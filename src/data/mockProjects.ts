import type { ProjectIdea } from "../types/project";

export const INITIAL_PROJECTS : ProjectIdea[] = [
    {
        id : 'project-1',
        title : 'This is a Demo Title - TITLE TITLE',
        rawInput : 'Fake raw input in order to simulate a fake project. This is a fake input and it is supposed to appear in the raw input section',
        notebookSketch : {
            dateTitle : 'October 2026',
            dateStamp : '23',
            monthStamp : 'Oct',
            subtitle : 'SUBTITLE -- test subtitle',
            mileStones : [
                {
                    date : '1',
                    text : 'MileStone 1'
                },
                {
                    date : '2',
                    text : 'MileStone 2'
                },
                {
                    date : '3',
                    text : 'MileStone 2'
                }
            ],
            quote : 'This is the quote that resum the project',
            workProjects : [
                {
                    num : '1',
                    title : 'TITLE 1',
                    desc : 'This is the first step in this project'
                },
                {
                    num : '2',
                    title : 'TITLE 2',
                    desc : 'This is the second step in this project'
                }
            ],
            keyFeatures : [
                {
                    symbol : '-->',
                    text : 'FIRST KEY FEATURE'
                },
                {
                    symbol : '-->',
                    text : 'SECOND KEY FEATURE'
                }
            ],
            devArchi : [
                {
                    symbol : '-->',
                    text : 'FIRST DEV STEP'
                },
                {
                    symbol : '-->',
                    text : 'SECOND DEV STEP'
                }
            ]
        },
        createdAt : new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        updatedAt : new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        isFavorite : true,
        completedSteps : [
            'This is the first step'
        ],
        mentorAnswers : {
            '0' : 'This is the answer to the first mentor question'
        },
        mvp : {
            mvpSteps : [
                'This is the first step',
                'This is the second step',
                'This is the third step'
            ]
        },
        mentor : {
            questions : [
                'QUESTION 1 : BLABLABLA',
                'QUESTION 2 : BLABLABLA'
            ]
        },
        traps : {
            skillsToLearn : [
                'First skill to learn is SKILL1',
                'Seecond skill to lean is SKILL2'
            ],
            trapsToAvoid : [
                'First trap to avoid is TRAP1',
                'Second trap to avoid is TRAP2'
            ]
        }
    }
]