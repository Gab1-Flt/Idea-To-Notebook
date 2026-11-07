import type { ProjectIdea } from "../types/project";

/*MockData for Project 1*/
export const INITIAL_PROJECTS: ProjectIdea[] = [
    {
        id: 'project-1',
        title: 'This is a Demo Title - TITLE TITLE',
        oneLiner: 'OneLiner of the first project test',
        rawInput: 'Fake raw input in order to simulate a fake project. This is a fake input and it is supposed to appear in the raw input section',
        notebookSketch: {
            dateTitle: 'MONTH 2026',
            dayStamp: 'Day',
            monthStamp: 'Month',
            versionBadge: 'v0',
            subTitle: 'This is a subtitle to test the feature',
            mileStones: [
                {
                    date: '10',
                    text: 'milestone 1, to complete before 10'
                },
                {
                    date: '17',
                    text: 'milesetone 2, to complete before 17'
                }
            ],
            quote: 'This a quote to describe my projet in few lines !',
            workProjects: [
                {
                    num: '1',
                    title: 'title 1',
                    desc: 'desc 1'
                },
                {
                    num: '2',
                    title: 'title 2',
                    desc: 'desc 2'
                }
            ],
            keyFeatures: [
                {
                    symbol: 'symbol 1',
                    text: 'text 1'
                },
                {
                    symbol: 'symbol 2',
                    text: 'text 2'
                }
            ],
            devArchi: [
                {
                    symbol: 'symbol 1',
                    text: 'text 1'
                }
            ]
        },
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        isFavorite: true,
        completedSteps: [
            'This is the first step'
        ],
        mentorAnswers: {
            '0': 'This is the answer to the first mentor question'
        },
        mvp: {
            mvpSteps: [
                'This is the first step',
                'This is the second step',
                'This is the third step'
            ]
        },
        mentor: {
            questions: [
                'QUESTION 1 : BLABLABLA',
                'QUESTION 2 : BLABLABLA'
            ]
        },
        traps: {
            skillsToLearn: [
                'First skill to learn is SKILL1',
                'Seecond skill to lean is SKILL2'
            ],
            trapsToAvoid: [
                'First trap to avoid is TRAP1',
                'Second trap to avoid is TRAP2'
            ]
        }
    }
]