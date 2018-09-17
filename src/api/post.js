import client from './client'

export function getPosts() {
  return client.get('post')
}

