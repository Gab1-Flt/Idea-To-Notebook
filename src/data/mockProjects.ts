import type { ProjectIdea } from "../types/project";

/*MockData for Project 1*/
export const INITIAL_PROJECTS : ProjectIdea[] = [
    {
        id : 'project-1',
        title : 'This is a Demo Title - TITLE TITLE',
        oneLiner: 'OneLiner of the first project test',
        rawInput : 'Fake raw input in order to simulate a fake project. This is a fake input and it is supposed to appear in the raw input section',
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