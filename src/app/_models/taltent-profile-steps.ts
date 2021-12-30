export class TalentProfileSteps {
    id: number = 0;
    name: string = "";
    talentProfileStepsOptions: TalentProfileSteps[] = [];

    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.name = data.talentProfile;
            this.talentProfileStepsOptions = [];
            data.talentProfile.forEach((q: any) => {
                this.talentProfileStepsOptions.push(new TalentProfileSteps(q));
            });
        }
    }
}
