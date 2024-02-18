const recommendationRequestFixtures = {
    oneRecommendation: {
        "id": 1,
        "requesterEmail": "sonic@ucsb.edu",
        "professorEmail": "eggman@ucsb.edu",
        "explanation": "Need letter of rec",
        "dateRequested": "2022-01-01T12:00:00",
        "dateNeeded": "2022-01-02T12:00:00",
        "done": "false"
    },
    threeRecommendations: [
        {
            "id": 1,
            "requesterEmail": "sonic@ucsb.edu",
            "professorEmail": "eggman@ucsb.edu",
            "explanation": "Need letter of rec",
            "dateRequested": "2022-01-01T12:00:00",
            "dateNeeded": "2022-01-02T12:00:00",
            "done": "false"
        },
        {
            "id": 2,
            "requesterEmail": "utterson@ucsb.edu",
            "professorEmail": "jekyll@ucsb.edu",
            "explanation": "Need letter of rec",
            "dateRequested": "2022-01-02T12:00:00",
            "dateNeeded": "2022-04-03T12:00:00",
            "done": "false"
        },
        {
            "id": 3,
            "requesterEmail": "frankenstein2@ucsb.edu",
            "professorEmail": "frankenstein@ucsb.edu",
            "explanation": "Need letter of rec",
            "dateRequested": "2022-01-03T12:00:00",
            "dateNeeded": "2022-07-04T12:00:00",
            "done": "true"
        }
    ]
};


export { recommendationRequestFixtures };