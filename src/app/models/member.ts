import { MemberStatusEnum } from '../enums/member-status.enum';

export interface Member {
    id: number;
    firstName: string;
    lastName: string;
    title: string;
    team: string;
    status: MemberStatusEnum;
}
