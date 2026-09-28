import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PromptForm } from './prompt-form'

describe('PromptForm', () => {
  let component: PromptForm
  let fixture: ComponentFixture<PromptForm>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptForm],
    }).compileComponents()

    fixture = TestBed.createComponent(PromptForm)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
