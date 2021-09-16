import Blog from "../../contracts/Blog.json";

function loadBlogContract(web3ReactState, address) {
  const web3 = web3ReactState.library;
  const { account } = web3ReactState;
  const contract = new web3.eth.Contract(Blog.abi, address);

  class BlogApi {
    constructor(contract) {
      this.contract = contract;
    }

    async myProfile() {
      const res = await this.contract.methods.getProfile(account).call({
        from: account,
      });
      return res;
    }

    async getProfile(address) {
      const res = await this.contract.methods.getProfile(address).call({
        from: account,
      });
      return res;
    }

    async updateProfile(updatedProfile) {
      const res = await this.contract.methods
        .updateProfile(updatedProfile)
        .send({
          from: account,
        });
      return res;
    }

    async addPost(newPost) {
      const res = await this.contract.methods.addPost(newPost).send({
        from: account,
      });
      return res;
    }

    async getPost(postId) {
      const res = await this.contract.methods.getPost(postId).call({
        from: account,
      });
      if (res.success) {
        const post = await this.contract.methods.posts(res.index).call({
          from: account,
        });
        return post;
      }
    }

    async getPostWithAuthorProfile(postId) {
      let post = await this.getPost(postId);
      if (post) {
        const profile = await this.getProfile(post.author);
        post = {
          ...post,
          extras: {
            author: profile,
          },
        };
        return post;
      } else {
        throw new Error("Post not found");
      }
    }

    async updatePost(postId, updatedPost) {
      const res = await this.contract.methods
        .updatePost(postId, updatedPost)
        .send({
          from: account,
        });
      return res;
    }

    async deletePost(postId) {
      const res = await this.contract.methods.deletePost(postId).send({
        from: account,
      });
      return res;
    }

    async getPosts() {
      const res = await this.contract.methods.getPosts().call({
        from: account,
      });
      return res;
    }

    /**
     * Tipping api
     */
    async myPendingTips() {
      const res = await this.contract.methods.myPendingTips().call({
        from: account,
      });
      return res;
    }

    async tipPost(postId, amount) {
      const res = await this.contract.methods.tipPost(postId, amount).send({
        from: account,
      });
      return res;
    }

    async withdrawTips() {
      const res = await this.contract.methods.withdrawTips().send({
        from: account,
      });
      return res;
    }

    async owner() {
      const res = await this.contract.methods.owner().call({
        from: account,
      });
      return res;
    }
    async blogName() {
      const res = await this.contract.methods.blogName().call({
        from: account,
      });
      return res;
    }
  }

  const api = new BlogApi(contract);

  return {
    Blog: {
      contract,
      api,
    },
  };
}

export default async function loadContracts(web3ReactState) {
  const web3 = web3ReactState.library;
  const id = await web3.eth.net.getId();
  const { address } = Blog.networks[id];
  let contracts = {};

  const loaders = [loadBlogContract];

  for (const loader of loaders) {
    const result = await loader(web3ReactState, address);
    contracts = {
      ...contracts,
      ...result,
    };
  }

  return contracts;
}
