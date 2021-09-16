const Blog = artifacts.require("Blog");

contract("Blog", async (accounts) => {
  it("adds a post to the blog", async () => {
    const blog = await Blog.deployed();
    const user1 = accounts[1];
    const wasAdded = await blog.addPost(
      "I love ethereum blockchain",
      "This is something that I really love!",
      {
        from: user1,
      }
    );
    console.log(wasAdded);

    const allPosts = await blog.getPosts();
    console.log(allPosts);
  });
});
