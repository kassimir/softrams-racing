import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModalMock } from '../mocks/modal.mock';

describe('AppService', () => {
  let controller: HttpTestingController;
  let service: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppService],
      imports: [HttpClientTestingModule]
    });

    controller = TestBed.get(HttpTestingController);
    service = TestBed.get(AppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get members', (done) => {
    service.getMembers()
      .subscribe(members => {
        expect(members).toEqual([ModalMock.mock.member])
      });

    const req = controller.expectOne('members');
    expect(req.request.method).toEqual('GET');
    req.flush([ModalMock.mock.member]);
    done();
  });

  it('should add member', (done) => {
    service.addMember(ModalMock.mock.member)
      .subscribe(res => {
        expect(res).toBe(JSON.stringify(ModalMock.mock.member));
      });

    const req = controller.expectOne('addMember');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(ModalMock.mock.member);
    req.flush(ModalMock.mock.member);
    done();
  });

  it('should delete member', (done) => {
    service.deleteMember(ModalMock.mock.member.id)
      .subscribe(res => {
        expect(res).toEqual(ModalMock.mock.member.id.toString())
      });

    const req = controller.expectOne('deleteMember');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({id: ModalMock.mock.member.id});
    req.flush(ModalMock.mock.member.id);
    done();
  });

  it('should get all teams', (done) => {
    service.getTeams()
      .subscribe(teams => {
        expect(teams).toEqual([])
      });

    const req = controller.expectOne('teams');
    expect(req.request.method).toEqual('GET');
    req.flush([]);
    done();
  });
});
