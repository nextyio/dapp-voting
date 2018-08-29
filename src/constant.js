import Blacklist from './../build/contracts/Blacklist.json';
import Voting from './../build/contracts/Voting.json';
export const USER_ROLE = {
    MEMBER : 'MEMBER',
    LEADER : 'LEADER',
    ADMIN : 'ADMIN',
    COUNCIL: 'COUNCIL'
};

const CONTRACT_ABI_Blacklist = Blacklist.abi;
const CONTRACT_ADDRESS_Blacklist = Blacklist.networks["66666"].address;

const CONTRACT_ABI_Voting = Voting.abi;
//const CONTRACT_ADDRESS_Voting = Voting.networks["66666"].address;
const CONTRACT_ADDRESS_Voting = "0xcbd01a5e5d9a555247dd209e21268f6cb116522d";

//testnet 
/*
export const WEB3 = {
    //Node 1
    HTTP : 'http://125.212.250.61:11111',
    //Node LAN
    //HTTP : 'http://172.16.1.8:8545',
    ABI: CONTRACT_ABI,
    ADDRESS_CONTRACT : CONTRACT_ADDRESS,
}
*/

// testnet local ganache

/*
export const WEB3 = {
    //HTTP : 'HTTP://127.0.0.1:8545',
    HTTP : 'http://125.212.250.61:11111',
    ABI: CONTRACT_ABI,
    ADDRESS_CONTRACT : CONTRACT_ADDRESS,
}
*/
export const WEB3 = {
    HTTP: 'http://125.212.250.61:11111', // testnet
    //HTTP: 'http://13.228.68.50:8545', // mainnet
    PAGE: {
        'Blacklist': {
            ABI: CONTRACT_ABI_Blacklist,
            ADDRESS: CONTRACT_ADDRESS_Blacklist
        },
        'Voting': {
            ABI: CONTRACT_ABI_Voting,
            ADDRESS: CONTRACT_ADDRESS_Voting
        }
    }
}


//To change WEB3 ABI ADDRESS

export const USER_LANGUAGE = {
    en: 'en',
    zh: 'zh'
}

export const TEAM_ROLE = {
    MEMBER : 'MEMBER',
    OWNER : 'OWNER'
};

export const TASK_CATEGORY = {
    DEVELOPER: 'DEVELOPER',
    SOCIAL: 'SOCIAL',
    LEADER: 'LEADER'
}

export const TASK_TYPE = {
    TASK: 'TASK',
    SUB_TASK: 'SUB_TASK',
    PROJECT: 'PROJECT',
    EVENT: 'EVENT'
}

export const TASK_STATUS = {
    PROPOSAL: 'PROPOSAL',
    CREATED: 'CREATED',
    APPROVED: 'APPROVED',
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    CANCELED: 'CANCELED',
    EXPIRED: 'EXPIRED'
}

export const TASK_CANDIDATE_TYPE = {
    USER: 'USER',
    TEAM: 'TEAM'
}

export const TASK_CANDIDATE_STATUS = {
    // NOT_REQUIRED: 'NOT_REQUIRED',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
}

export const COMMUNITY_TYPE = {
    COUNTRY: 'COUNTRY',
    STATE: 'STATE',
    CITY: 'CITY',
    REGION: 'REGION',
    SCHOOL: 'SCHOOL'
}

export const TRANS_STATUS = {
    PENDING: 'PENDING',
    CANCELED: 'CANCELED',
    FAILED: 'FAILED',
    SUCCESSFUL: 'SUCCESSFUL'
}

export const ISSUE_CATEGORY = {
    BUG: 'BUG',
    SECURITY: 'SECURITY',
    SUGGESTION: 'SUGGESTION',
    OTHER: 'OTHER'
}

export const CONTRIB_CATEGORY = {
    BLOG: 'BLOG',
    VIDEO: 'VIDEO',
    PODCAST: 'PODCAST',
    OTHER: 'OTHER'
}

export const DEFAULT_IMAGE = {
    TASK : '/assets/images/task_thumbs/12.jpg'
};

export const MIN_VALUE_DEPOSIT = 500000;
