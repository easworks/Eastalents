import { TextFieldModule } from '@angular/cdk/text-field';
import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, Signal, WritableSignal, computed, effect, inject, input, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OpenAIApi } from '@easworks/app-shell/api/open-ai';
import { controlStatus$, controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { JobPost } from '@easworks/models';
import { mockJobPost } from './mock-job-post';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'employer-view-job-post',
  templateUrl: './view-job-post.page.html',
  styleUrls: ['./view-job-post.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatPseudoCheckboxModule,
    MatCheckboxModule,
    FormImportsModule,
    MatAutocompleteModule,
    MatSelectModule,
    TextFieldModule,
    MatExpansionModule
  ]
})
export class ViewJobPostPageComponent {
  protected readonly jobPost$ = input.required<JobPost>({ alias: 'jobPost' });

  protected header$ = computed(() => {
    // cost
  });
}