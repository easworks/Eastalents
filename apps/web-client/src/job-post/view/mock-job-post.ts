import { JobPost } from "@easworks/models";

export const mockJobPost: JobPost = {
    "createdBy": '6657e0291e5d98dbd1d3407c',
    "status": 'Awaiting Approval',
    "jobType": "Project Outsourcing",
    "projectType": "New",
    "description": "Here is a sample job description for a social media manager: Are you passionate about creating engaging and creative content for social media platforms? Do you have experience in managing and growing online communities? If yes, then we are looking for you! We are a leading digital marketing agency that helps clients achieve their business goals through effective social media strategies. We are looking for a social media manager who can plan, create, and execute campaigns for various platforms such as Facebook, Instagram, Twitter, and LinkedIn.",
    "requirements": {
        "commitment": "20 - 30 hrs",
        "engagementPeriod": "2 - 4 weeks",
        "experience": "Individual Contributor",
        "hourlyBudget": "Less than $50",
        "projectKickoff": "Immediately",
        "environment": "On-Premise"
    },
    "domain": {
        "key": "IaaS",
        "years": 25,
        "services": [
            "Auto Scaling and Elasticity",
            " Kubernetes",
        ],
        "modules": [
            "Cloud Storage",
            "Data Warehouse Appliance"
        ],
        "roles":
        {
            "role": "Back-End engineer",
            "years": 25,
            "quantity": 1,
            "software": [
                "Amazon Web Services (AWS)",
                "DigitalOcean"
            ]
        }
        // ,
        // {
        //     "role": "Cloud Application Support Specialist",
        //     "years": 20,
        //     "quantity": 1,
        //     "software": [
        //         "CloudSigma"
        //     ]
        // }

    },
    "tech": [
        {
            "group": "Administration",
            "items": [
                " X3 Management Console",
                "Manhattan Associates Admin Console"
            ]
        },
        {
            "group": "API",
            "items": [
                "Algolia API",
                "Google APIs"
            ]
        }
    ],
    "industries": [
        {
            "group": "Administrative Services",
            "items": [
                "College Recruiting",
                "Courier Service"
            ]
        }
    ],
    "count": {
        "positions": 1,
        "applications": 10,
        "hired": 0,
        "interviewScheduled": 3,
        "rejected": 5,
        "unseen": 2,
    }
};