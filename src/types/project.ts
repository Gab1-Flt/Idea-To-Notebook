/*All the types required for the website*/
export type TabType = 'Sketch' | 'MVP' | 'Mentor' | 'Traps' | 'Raw';

export interface MvpContent {
    mvpSteps : string[];
}

export interface MentorContent {
    questions : string[];
}

export interface TrapsContent {
    skillsToLearn : string[];
    trapsToAvoid : string[];
}

export interface WorkProjectItem {
    num : string;
    title : string;
    desc : string;
}

export interface ActionCheckItem {
    symbol : string;
    text : string;
}

export interface MileStoneItem {
    date : string;
    text : string;
}

export interface Sketch {
    dateTitle : string;
    dateStamp : string;
    monthStamp: string;
    subtitle : string;
    mileStones : MileStoneItem[];
    quote : string;
    workProjects : WorkProjectItem[];
    keyFeatures : ActionCheckItem[];
    devArchi : ActionCheckItem[];
}

export interface ProjectIdea {
    id : string;
    title : string;
    rawInput : string;
    notebookSketch? : Sketch;
    createdAt : string;
    updatedAt? : string;
    isFavorite? : boolean;
    completedSteps? : string[];
    mentorAnswers? : Record<string, string>;
    mvp : MvpContent;
    mentor : MentorContent;
    traps : TrapsContent;
}
