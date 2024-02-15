const helpRequestFixtures = {
    oneHelpRequest:{
        "id": 1,
        "requesterEmail": "me@ucsb.edu",
        "teamId": "w24-5pm-2",
        "tableOrBreakoutRoom": "1",
        "requestTime": "2022-01-02T12:00:00",
        "explanation": "help1",
        "solved":"True"

      },

    threeHelpRequests:
    [
        {
            "id": 2,
            "requesterEmail": "you@ucsb.edu",
            "teamId": "w24-5pm-1",
            "tableOrBreakoutRoom": "2",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "help2",
            "solved":"False"      
        },

        {
            "id": 3,
            "requesterEmail": "they@ucsb.edu",
            "teamId": "w24-4pm-3",
            "tableOrBreakoutRoom": "3",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "help3",
            "solved":"True"  
        },

        {
            "id": 4,
            "requesterEmail": "us@ucsb.edu",
            "teamId": "w24-4pm-2",
            "tableOrBreakoutRoom": "4",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "help4",
            "solved":"False" 
        },
        
    ]
};

export { helpRequestFixtures };