export class Activity {

    constructor(
        public id: string,
        public order: number,
        public name:string,
        public duration: string,
        public contact: string,
        public notes: string,
        public day: number,
        public week: number,
    ){}
}
