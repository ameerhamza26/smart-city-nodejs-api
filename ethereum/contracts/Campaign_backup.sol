pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    address public currentCampaign;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        currentCampaign = newCampaign;
        deployedCampaigns.push(newCampaign);
    }

    function getCurrentCampaign() public view returns (address) {
        return currentCampaign;
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}

contract PostFactory {
    address[] public deployedPosts;
    mapping(address => address) public postsLocation;

    event ContractCreated(address newAddress);

    function createPost(string title, string description,  string loc, string lat, string lon) public returns (address) {
        address newPost = new Post(msg.sender, title, description);
        deployedPosts.push(newPost);
        ContractCreated(newPost);
        address newPostLocation = new PostLocation(newPost, loc, lat, lon);
        postsLocation[newPost] = newPostLocation;
        return newPost;
    }

    function getDeployedPost() public view returns (address[]) {
        return (deployedPosts);
    }
    
    function getLatestPost() public view returns (address) {
        return deployedPosts[deployedPosts.length-1];
    }
}

contract Post {
    address public creator;
    string[] public images;
    string public title;
    string public description;
    uint public approversCount = 0;
    int public points;
    address[] public approvers;
    mapping(address => bool) public approversMap;

    modifier restricted() {
        require(msg.sender != creator);
        _;
    }

    function Post(address creat, string t, string desc) public {
        creator = creat;
        title = t;
        description = desc;
    }

    function addImage(string image) public {
        images.push(image);
    }


    function addApprover(address user) public payable {
        approvers.push(user);
    }
    
    function getPostApprovers() public view returns (address[]) {
        return approvers;
    }
    
    function approve() public restricted {
        require(!approversMap[msg.sender]);
        approversMap[msg.sender] = true;
        approversCount = approversCount + 1;
    }
    
    function getPost() public view returns (address, string, string, uint, int) {
        return (creator, title, description, approversCount, points);
    }
}

contract PostLocation {
    address public post;
    string public location;
    string public latitude;
    string public longitude;
    
    function PostLocation(address p, string loc, string lat, string lon) public {
        post = p;
        location = loc;
        latitude = lat;
        longitude = lon;
    }
    
}