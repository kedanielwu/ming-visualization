import {observable, computed} from 'mobx'

class UIStore {
  @observable selectedSession;
}

export default new UIStore()