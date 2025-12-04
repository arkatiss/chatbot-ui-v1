import { TestBed } from '@angular/core/testing';

import { VoicerecognitionService } from './voicerecognition.service';

describe('VoicerecognitionService', () => {
  let service: VoicerecognitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoicerecognitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
