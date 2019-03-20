import {observable, computed} from 'mobx'

class UIStore {
  @observable selectedSession
  @observable selectedParticipants = []
}

export default new UIStore()