import { Component, Input } from '@angular/core'

export interface ErrorMessage {
  headerIconName?: string
  text: string
  header: string
  interpolateParams?: any
  actions?: {
    callback: () => void
    actionText: string
    iconName?: string
  }[]
}


@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input() message?: ErrorMessage
  @Input() showLanguageSelector = false

  constructor() {}
}
