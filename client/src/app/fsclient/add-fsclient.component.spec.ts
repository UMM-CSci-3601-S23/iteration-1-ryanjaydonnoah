import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockFsclientService } from 'src/testing/fsclient.service.mock';
import { AddFsclientComponent } from './add-fsclient.component';
import { FsclientService } from './fsclient.service';

describe('AddFsclientComponent', () => {
  let addFsclientComponent: AddFsclientComponent;
  let addFsclientForm: FormGroup;
  let fixture: ComponentFixture<AddFsclientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(FsclientService, { useValue: new MockFsclientService() });
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [AddFsclientComponent],
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFsclientComponent);
    addFsclientComponent = fixture.componentInstance;
    fixture.detectChanges();
    addFsclientForm = addFsclientComponent.addFsclientForm;
    expect(addFsclientForm).toBeDefined();
    expect(addFsclientForm.controls).toBeDefined();
  });

  // Not terribly important; if the component doesn't create
  // successfully that will probably blow up a lot of things.
  // Including it, though, does give us confidence that our
  // our component definitions don't have errors that would
  // prevent them from being successfully constructed.
  it('should create the component and form', () => {
    expect(addFsclientComponent).toBeTruthy();
    expect(addFsclientForm).toBeTruthy();
  });

  // Confirms that an initial, empty form is *not* valid, so
  // people can't submit an empty form.
  it('form should be invalid when empty', () => {
    expect(addFsclientForm.valid).toBeFalsy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = addFsclientComponent.addFsclientForm.controls.name;
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "Chris Smith"', () => {
      nameControl.setValue('Chris Smith');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail on single character names', () => {
      nameControl.setValue('x');
      expect(nameControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
      expect(nameControl.hasError('minlength')).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long names', () => {
      nameControl.setValue('x'.repeat(100));
      expect(nameControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      nameControl.setValue('Bad2Th3B0ne');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail if we provide an "existing" name', () => {
      // We're assuming that "abc123" and "123abc" already
      // exist so we disallow them.
      nameControl.setValue('abc123');
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('existingName')).toBeTruthy();

      nameControl.setValue('123abc');
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('existingName')).toBeTruthy();
    });
  });

  describe('The age field', () => {
    let ageControl: AbstractControl;

    beforeEach(() => {
      ageControl = addFsclientComponent.addFsclientForm.controls.age;
    });

    it('should not allow empty ages', () => {
      ageControl.setValue('');
      expect(ageControl.valid).toBeFalsy();
    });

    it('should be fine with "27"', () => {
      ageControl.setValue('27');
      expect(ageControl.valid).toBeTruthy();
    });

    it('should fail on ages that are too low', () => {
      ageControl.setValue('14');
      expect(ageControl.valid).toBeFalsy();
      expect(ageControl.hasError('min')).toBeTruthy();
    });

    it('should fail on negative ages', () => {
      ageControl.setValue('-27');
      expect(ageControl.valid).toBeFalsy();
      expect(ageControl.hasError('min')).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like ages.
    it('should fail on ages that are too high', () => {
      ageControl.setValue(201);
      expect(ageControl.valid).toBeFalsy();
      // I have no idea why I have to use a lower case 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      // But I apparently do.
      expect(ageControl.hasError('max')).toBeTruthy();
    });

    it('should not allow an age to contain a decimal point', () => {
      ageControl.setValue(27.5);
      expect(ageControl.valid).toBeFalsy();
      expect(ageControl.hasError('pattern')).toBeTruthy();
    });
  });

  describe('The company field', () => {
    it('should allow empty values', () => {
      const companyControl = addFsclientForm.controls.company;
      companyControl.setValue('');
      expect(companyControl.valid).toBeTruthy();
    });
  });

  describe('The email field', () => {
    let emailControl: AbstractControl;

    beforeEach(() => {
      emailControl = addFsclientComponent.addFsclientForm.controls.email;
    });

    it('should not allow empty values', () => {
      emailControl.setValue('');
      expect(emailControl.valid).toBeFalsy();
      expect(emailControl.hasError('required')).toBeTruthy();
    });

    it('should accept legal emails', () => {
      emailControl.setValue('conniestewart@ohmnet.com');
      expect(emailControl.valid).toBeTruthy();
    });

    it('should fail without @', () => {
      emailControl.setValue('conniestewart');
      expect(emailControl.valid).toBeFalsy();
      expect(emailControl.hasError('email')).toBeTruthy();
    });
  });

  describe('The role field', () => {
    let roleControl: AbstractControl;

    beforeEach(() => {
      roleControl = addFsclientForm.controls.role;
    });

    it('should not allow empty values', () => {
      roleControl.setValue('');
      expect(roleControl.valid).toBeFalsy();
      expect(roleControl.hasError('required')).toBeTruthy();
    });

    it('should allow "admin"', () => {
      roleControl.setValue('admin');
      expect(roleControl.valid).toBeTruthy();
    });

    it('should allow "editor"', () => {
      roleControl.setValue('editor');
      expect(roleControl.valid).toBeTruthy();
    });

    it('should allow "viewer"', () => {
      roleControl.setValue('viewer');
      expect(roleControl.valid).toBeTruthy();
    });

    it('should not allow "Supreme Overlord"', () => {
      roleControl.setValue('Supreme Overlord');
      expect(roleControl.valid).toBeFalsy();
    });
  });
});
