export class TalentProfile {
    stepObject: TalentProfileSteps[] = new Array<TalentProfileSteps>(32);

    constructor(data: any) {
        if (data) {
            this.stepObject = [];
            for (let index = 0; index <= data; index++) {
                this.stepObject.push(new TalentProfileSteps());

            }
        }
    }
}


export class TalentProfileSteps {
    id: number = 0;
    step: string = "";
    optionObj: any;
    constructor() {
        this.step = "";
        this.optionObj = {};
        this.id = 0
    }
}
