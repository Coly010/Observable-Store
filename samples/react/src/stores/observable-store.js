import { BehaviorSubject } from 'rxjs';
import { ClonerService } from './utilities/cloner.service';
export class ObservableStore {
    constructor(initialState, trackStateHistory = false) {
        this.stateHistory = [];
        this.trackStateHistory = trackStateHistory;
        this.initStore(initialState);
    }
    initStore(initialState) {
        //Not injecting service since we want to use ObservableStore outside of Angular
        this.clonerService = new ClonerService();
        this.stateDispatcher = new BehaviorSubject(initialState);
        this.stateChanged = this.stateDispatcher.asObservable();
        this.setState('init', initialState);
    }
    dispatchState() {
        const clone = this.clonerService.deepClone(this.state);
        this.stateDispatcher.next(clone);
    }
    setState(action, state) {
        this.state = Object.assign({}, this.state, state);
        this.dispatchState();
        if (this.trackStateHistory) {
            this.stateHistory.push({ action, state });
        }
    }
    getState() {
        return this.clonerService.deepClone(this.state);
    }
    resetState(initialState) {
        this.initStore(initialState);
    }
    getNestedProp(p) {
        return p.reduce((xs, x) => {
            if (xs === null || xs === undefined) {
                return null;
            }
            else {
                return xs[x];
            }
        }, this.state);
    }
}
//# sourceMappingURL=observable-store.js.map