pragma solidity ^0.4.17;

contract SmartCityContract {
    
    struct User {
        address id;
        uint points;
    }
    
    struct Post {
        uint id;
        string description;
        string imageBefore;
        string imageAfter;
        uint value;
        address manager;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
        address[] approvers;
        uint minimumApprovalsCount;
    }
    
    struct Location {
        uint postId;
        string location;
        string latitude;
        string longitude;
    }

    Post[] public posts;
    User[] public users;
    Location[] public locations;
    
    function createUser(address id, uint points) public {
        bool isFound = isUserExist(id);
        require(isFound == false);
        User memory newUser = User({
            id: id,
            points: points
        });
        
        users.push(newUser);
    }
    
    function getUsersLength() public view returns (uint) {
        return users.length;
    }
    
    function findUserById(address id) public view returns (User) {
        User memory user;
        for (uint i =0; i < users.length; i++) {
            if (id == users[i].id) {
                user = User({
                    id: users[i].id,
                    points: users[i].points
                });
                break;
            }
        }
        
        return (user);
    }
    
    function findUserDetailsById(address id) public view returns (address, uint) {
        address userid;
        uint points;
        for (uint i =0; i < users.length; i++) {
            if (id == users[i].id) {
                userid = users[i].id;
                points = users[i].points;
                break;
            }
        }
        
        return (userid,points);
    }
    
    function findUserIndexById(address id) public view returns (uint) {
        uint index= 0;
        for (uint i =0; i < users.length; i++) {
            if (id == users[i].id) {
                index = i;
                break;
            }
        }
        
        return (index);
    }
    
    function isUserExist(address id) public view returns (bool) {
        bool isFound = false;
        for (uint i =0; i < users.length; i++) {
            if (id == users[i].id) {
               isFound = true;
            }
        }
        
        return isFound;
    }
    
    function isPostApprovedByApprover(uint id, address userid) public view returns (bool) {
        for (uint i =0; i < posts.length; i++) {
            if (id == posts[i].id && posts[i].approvals[userid]) {
                return true;
            }
        }
        return false;
    }
    
    function getUserPoints(address id) public view returns (uint) {
        User memory user;
        for (uint i =0; i < users.length; i++) {
            if (id == users[i].id) {
                user = User({
                    id: users[i].id,
                    points: users[i].points
                });
            }
        }
        
        return user.points;
    }
    
    function minusPoints(address id, uint points) public {
        User memory user;
        uint userindex ;
        user = findUserById(id);
        userindex = findUserIndexById(id);
        user.points = user.points - points;
        users[userindex] = user;
    }

    function createPost(string description, string imageBefore, string imageAfter, string location, string latitude, string longitude, uint value, address recipient, address[] add, uint minimumApprovalsCount) public {
        bool isFound = isUserExist(recipient);
        require(isFound == true);
        uint id = 0;
        if (posts.length > 0) {
            id = posts[posts.length -1].id + 1;
        }
        Post memory newPost = Post({
           id : id,
           description: description,
           value: value,
           manager: recipient,
           complete: false,
           approvalCount: 0,
           approvers: add,
           imageBefore: imageBefore,
           imageAfter: imageAfter,
           minimumApprovalsCount: minimumApprovalsCount
        });
        
        Location memory newLocation = Location({
            postId: id,
            location: location,
            latitude: latitude,
            longitude: longitude
        });

        posts.push(newPost);
        locations.push(newLocation);
    }
    
    function getPostApprovers(uint index) public view returns (address[]) {
        Post storage post = posts[index];
        return post.approvers;
    }
    
    function getPostLocation(uint postid) public view returns (Location) {
        Location memory location;
        if (locations.length > 0) {
            for (uint i = 0; i < locations.length; i++) {
                if (locations[i].postId == postid) {
                    location = locations[i];
                    break;
                }
            }
        }
        return location;
    }

    function approvePost(uint index, address id) public {
        Post storage post = posts[index];
        
        bool isFound = false;
        for (uint i=0; i < post.approvers.length; i++) {
            if (id == post.approvers[i] && isUserExist(id)) {
                isFound = true;
                break;
            }
        }
        
        require(isFound);
        require(!post.approvals[id]);
        post.approvals[id] = true;
        post.approvalCount++;
        finalizePost(index);
    }

    function finalizePost(uint index) private {
        Post storage post = posts[index];
        if (post.approvalCount == post.minimumApprovalsCount && !post.complete) {
            User memory user;
            uint userindex ;
            user = findUserById(post.manager);
            userindex = findUserIndexById(post.manager);
            user.points = user.points + post.value;
            users[userindex] = user;
            for (uint i =0; i < post.approvers.length; i++) {
                if (post.approvals[post.approvers[i]]) {
                    user = findUserById(post.approvers[i]);
                    userindex = findUserIndexById(post.approvers[i]);
                    user.points = user.points + 1;
                    users[userindex] = user;
                }
            }
            post.complete = true;
        }
    }
    
    function getPostByApprover(address userid) public view returns (uint[]) {
        uint[] memory approvalPosts;
        for (uint i=0; i< posts.length; i++) {
            if (posts[i].approvals[userid]) {
                approvalPosts[i] = posts[i].id;
            }
        }
        
        return approvalPosts;
    }
}