
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {from} from 'rxjs/observable/from';
import {of } from 'rxjs/observable/of';
import {concatMap} from 'rxjs/operator/concatMap';
import {every} from 'rxjs/operator/every';
import {first} from 'rxjs/operator/first';
import {map} from 'rxjs/operator/map';
import {mergeMap} from 'rxjs/operator/mergeMap';
import {reduce} from 'rxjs/operator/reduce';
import {letProto} from 'rxjs/operator/let';

import {NavigationParams} from './router';

export function processNavigations(nav?: NavigationParams): Observable {
  if (nav) {
    this.executeScheduledNavigation(nav);
    // a failed navigation should not stop the router from processing
    // further navigations => the catch
    return nav.promise.catch(() => {});
  } else {
    return <any>of (null);
  }
}