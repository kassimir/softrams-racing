export class Member {
    id: number;
    firstName: string;
    lastName: string;
    jobTitle: string;
    team: string;
    status: string;

    constructor(id, firstName, lastName, jobTitle, team, status) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.jobTitle = jobTitle;
        this.team = team;
        this.status = status;
    }
}
