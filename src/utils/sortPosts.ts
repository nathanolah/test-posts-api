const merge = (
  posts: any,
  l: number,
  m: number,
  r: number,
  sortBy: any,
  direction: any
) => {
  let res = posts.slice(l, r + 1);
  let i1 = l;
  let i2 = m + 1;
  let i = l;

  while (i1 <= m && i2 <= r) {
    const v1 = res[i1 - l][sortBy];
    const v2 = res[i2 - l][sortBy];

    if (direction === "desc") {
      if (v1 > v2) {
        posts[i++] = res[i1 - l];
        ++i1;
      } else {
        posts[i++] = res[i2 - l];
        ++i2;
      }
    } else {
      if (v1 < v2) {
        posts[i++] = res[i1 - l];
        ++i1;
      } else {
        posts[i++] = res[i2 - l];
        ++i2;
      }
    }
  }

  while (i1 <= m) {
    posts[i++] = res[i1++ - l];
  }

  while (i2 <= m) {
    posts[i++] = res[i2++ - l];
  }
};

const mergeSortRange = (
  posts: any,
  start: number,
  end: number,
  sortBy: any,
  direction: any
) => {
  if (start >= end) return;
  let mid = Math.floor(start + (end - start) / 2);
  mergeSortRange(posts, start, mid, sortBy, direction);
  mergeSortRange(posts, mid + 1, end, sortBy, direction);
  merge(posts, start, mid, end, sortBy, direction);
};

// merge sort the posts in either ascending or descending order
export const sortPosts = (posts: any, sortBy: any, direction: any) => {
  mergeSortRange(posts, 0, posts.length - 1, sortBy, direction);
};
