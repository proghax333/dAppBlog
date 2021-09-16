// Blog.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Blog {
  /// ------------------------------------------

  /**
   * User profile related details
   */
  struct Profile {
    string name;
  }
  struct ProfileWithExtras {
    address _address;
    string name;
  }

  mapping (address => Profile) public profiles;

  /**
   * @dev get message sender's profile
   */
  function myProfile() public view returns (ProfileWithExtras memory) {
    return getProfile(msg.sender);
  }

  
  /**
   * @dev get profile by address
   */
  function getProfile(address profileAddress) public view returns (ProfileWithExtras memory) {
    return ProfileWithExtras(profileAddress, profiles[profileAddress].name);
  }

  /**
   * @dev update profile
   */
  function updateProfile(Profile memory updatedProfile) public returns (bool) {
    Profile storage profile = profiles[msg.sender];
    profile.name = updatedProfile.name;
    return true;
  }

  /**
   * Tipping system
   */
  mapping (address => uint) public pendingWithdrawals;

  /**
   * @dev get sender's pending withdrawals
   */
  function myPendingTips() public view returns(uint) {
    return pendingWithdrawals[msg.sender];
  }

  /**
   * @dev tip the post writer
   */
  function tipPost(uint postId) public payable returns (bool) {
    uint sentAmount = msg.value;
    require(sentAmount > 0, "No tip was sent");

    (bool success, uint index) = getPost(postId);
    require(success, "Post not found");
    Post storage post = posts[index];

    address author = post.author;
    pendingWithdrawals[author] += sentAmount;
    return true;
  }

  /**
   * @dev withdraw tips
   */
  function withdrawTips() public returns (bool) {
    uint pendingTips = pendingWithdrawals[msg.sender];

    require(pendingTips > 0, "No tips pending for withdrawal");

    address payable author = msg.sender;
    pendingWithdrawals[author] = 0;
    author.transfer(pendingTips);
    return true;
  }

  /**
   * @dev Post structure to store a blog post
   */
  struct Post {
    uint postId;
    address payable author;
    string title;
    string content;
    uint createdAt;
  }

  struct PostDto {
    string title;
    string content;
  }

  Post[] public posts;
  uint public postsCount = 0;

  /**
   * @dev Events provided by blog application
   */
  event AddPost(
    address indexed _author,
    uint indexed postId,
    uint createdAt
  );
  event DeletePost(
    address indexed _author,
    uint indexed postId
  );


  /// ------------------------------------------

  /**
   * @dev Blog related details
   */
  address payable public owner;
  string public blogName;

  /**
   * @dev initializes blog with a blog name
   */
  constructor(string memory newBlogName) public {
    owner = msg.sender;
    blogName = newBlogName;

    // test code. to be removed in production

    updateProfile(Profile("Blog owner"));

    addPost(PostDto("Post 1", "This is the content of post 1"));
    addPost(PostDto("Post 2", "This is the content of post 2"));
    addPost(PostDto("Post 3", "This is the content of post 3"));
  }

  /**
   * @dev Add post by postId
   */
  function addPost(PostDto memory newPost) public returns (bool success) {
    ++postsCount;
    uint createdAt = now;
    Post memory post = Post(
      postsCount,
      msg.sender,
      newPost.title,
      newPost.content,
      createdAt
    );
    posts.push(post);

    emit AddPost(msg.sender, postsCount, createdAt);
    return true;
  }

  /**
   * @dev Get post by postId
   */
  function getPost(uint postId) public view returns(bool success, uint index) {
    uint i = 0;
    while(i < postsCount) {
      Post storage p = posts[i];
      if(p.postId == postId) {
        return (true, i);
      }
      i++;
    }
    return (false, 0);
  }

  /**
   * @dev Update post by postId
   */
  function updatePost(uint postId, PostDto memory updatedPost) public returns(bool) {
    ( bool success, uint index ) = getPost(postId);
    require(success, "Post not found");

    Post storage post = posts[index];
    require(isPostOwner(post), "You are not the owner of this post");

    post.title = updatedPost.title;
    post.content = updatedPost.content;
    
    return true;
  }

  /**
   * @dev Delete post by postId
   */
  function deletePost(uint postId) public returns (bool) {
    ( bool success, uint index ) = getPost(postId);
    require(success, "Post not found");

    Post storage post = posts[index];
    require(isPostOwner(post), "You are not the owner of this post");
    delete posts[index];

    emit DeletePost(msg.sender, postId);

    return true;
  }

  /**
   * @dev Get all posts
   */
  function getPosts() public view returns(Post[] memory) {
    return posts;
  }

  /**
   * @dev validate whether a post is owned by an address
   */
  function isPostOwner(Post memory post) private view returns(bool) {
    return msg.sender == post.author;
  }

  // ------------- Contract owner functions -------------------- //
  /**
   * @dev Change blog name
   */
  function changeBlogName(string memory _newBlogName) public onlyOwner {
    blogName = _newBlogName;
  }

  /**
   * @dev Modifier that check whether the sender of the message is owner of the contract.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

}
