// Imported packages
import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import LanguageDetect from 'languagedetect';
import fetch from 'node-fetch';

// Set the allowed languages for the language detector.
const lngDetector = new LanguageDetect();
const allowedLanguages = ['dutch']

// Set the minimum number of likes for an Ajax post that is written by an author that is not
// on the gray or whitelist.
const likeThreshold = 3;

// Create the post store for Ajax posts written by authors not on the gray or whitelist.
let postStore = new Map<string, number>();

// Links to the handle resolver and config lists.
const handleResolveUrl = 'https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle='
import authorWhitelist from "./lists/authorWhitelist.json"
import authorGreylist from "./lists/authorGreylist.json"
import ajaxHitWords from "./lists/ajaxHitWords.json"

// Fetch the user DIDs from the given user handles.
type UserDid = {
  did: string
}
async function fetchUserDids(userHandles, resultList) {
  for (let handle of userHandles) {
    const response = await fetch(handleResolveUrl + handle, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const result = (await response.json()) as UserDid;
    resultList.push(result.did)
  }
}

// Fetch user DIDs from the whitelist.
const whitelistDids: string[] = [];
fetchUserDids(authorWhitelist.whitelistHandles, whitelistDids)

// Fetch user DIDs from the greylist.
const greylistDids: string[] = [];
fetchUserDids(authorGreylist.greylistHandles, greylistDids)


export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return

    const ops = await getOpsByType(evt)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => {
        // Include all posts from authors on the whitelist
        if (whitelistDids.includes(create.author)) {
          return true
        }

        // Include posts from authors on the greylist if they include a word from the Ajax hit words.
        if (greylistDids.includes(create.author)) {
          return ajaxHitWords.hitWords.some(hitWord => create.record.text.toLowerCase().includes(hitWord))
        }

        // Add Ajax posts to the post store if they include words from the Ajax hit list and if they
        // are not authored by an author on the greylist or whitelist.
        if (ajaxHitWords.hitWords.some(hitWord => create.record.text.toLowerCase().includes(hitWord)) &&
            allowedLanguages.includes(lngDetector.detect(create.record.text, 1)[0][0])) {
          postStore.set(create.uri, 0)
        }

        // Ignore other posts.
        return false
      })
      .map((create) => {
        // map ajax-related posts to a db row
        return {
          uri: create.uri,
          cid: create.cid,
          indexedAt: new Date().toISOString(),
        }
      })

    const likesToCreate = ops.likes.creates
        .filter(like => {
          if (postStore.has(like.record.subject.uri)) {
            // Increase the like counter in the post store if a post in de store is liked.
            // @ts-ignore
            postStore.set(like.record.subject.uri, postStore.get(like.record.subject.uri) + 1)

            // Add posts to the feed if the number of likes surpasses the threshold.
            if (postStore.get(like.record.subject.uri) == likeThreshold) {
              return true
            }
          }
          return false
        })
        .map((create) => {
          // map ajax-related posts to a db row
          return {
            uri: create.record.subject.uri,
            cid: create.record.subject.cid,
            indexedAt: new Date().toISOString(),
          }
        })

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
    if (likesToCreate.length > 0) {
      await this.db
          .insertInto('post')
          .values(likesToCreate)
          .onConflict((oc) => oc.doNothing())
          .execute()
    }

    // Clear the post store each night.
    if (new Date().toTimeString().startsWith("23:59:59")) {
      postStore = new Map<string, number>();
    }
  }
}
