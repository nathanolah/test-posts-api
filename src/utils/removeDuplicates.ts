// Maps the duplicates and counts the frequencies
// Removes any duplicate values that exists in the map and updates the posts
export const removeDuplicates = (posts: any) => {
  const map = new Map();

  for (let i = 0; i < posts.length; i++) {
    if (map.has(posts[i].id)) {
      posts.splice(i, 1);
    } else {
      map.set(posts[i].id, 1);
    }
  }
};
