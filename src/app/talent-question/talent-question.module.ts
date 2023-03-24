import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GaugeChartModule } from 'angular-gauge-chart';
import { ToastrModule } from 'ngx-toastr';
import { TalentQuestionComponent } from './talent-question.component';
import { TalentQuestionSelectItemComponent } from './talent-question-select-item/talent-question-select-item/talent-question-select-item.component';
import { EmployerSelectItemTalentQuestionComponent } from './employer-select-item-talent-question/employer-select-item-talent-question.component';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { DatafilterTalentPipe } from './datafilter.pipe';

const routes: Routes = [
  {
    path: '',
    component: TalentQuestionComponent,
  },
];

@NgModule({
  declarations: [
    TalentQuestionComponent,
    TalentQuestionSelectItemComponent,
    EmployerSelectItemTalentQuestionComponent,
    BlockCopyPasteDirective,
    DatafilterTalentPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    GaugeChartModule,
    ReactiveFormsModule,
    ToastrModule,
    RouterModule.forChild(routes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TalentQuestionModule {}
