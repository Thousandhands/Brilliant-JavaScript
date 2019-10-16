/**
 * @file react-router-dom
 * @author changan
 */

import React, { Component } from 'react';



/**
 * 创建一个react的context的工厂方法
 */
const createContext = () => {
    let context = React.createContext(null);
    return context;
}

/**
 * 创建一个location对象
 * @param {string} path 
 * @param {*} state 
 */
const createLocation = (path, state) => {
    let pathInfo = /^([^\?]*)(\?[^#*])?(\#.*)?/.exec(path);
    console.log(pathInfo, '   pppppp');
    return {
        pathname: pathInfo[1],
        search: pathInfo[2],
        hash: pathInfo[3],
        state
    }
};

const getDOMLocation = (state) => {
    let window$location = window.location;
    let pathname = window$location.pathname;
    let search = window$location.search;
    let hash = window$location.hash;


    return createLocation(`${pathname}${search}${hash}`, state);
}

let eventEmitter = {
    listener: [],
    notify(...args) {
        this.listener.forEach(listener => listener(...args));
    },
    listen(func) {
        this.listener.push(func);
    }
};

const createBrowserHistory = () => {
    const listen = (func) => {
        // 往监听器里面加一项
        eventEmitter.listen(func);

    }

    const DOMListen = (func) => {
        window.addEventListener('popstate', func);
    }

    DOMListen((event) => {
        // location变化
        let action = 'pop';
        let location = getDOMLocation(event.state);
        setState({
            action,
            location
        });
    });

    const push = (path, state) => {
        let action = 'push';
        let location = createLocation(path, state);
        window.history.pushState({
            state
        }, null, path);
        setState({
            action,
            location
        });
    };

    const setState = (nextState) => {
        // 催动界面，变化，设置新的状态
        Object.assign(history, nextState);
        // 触发外部监听
        eventEmitter.notify(history);
    }


    return {
        push,
        listen
    }
}


const RouterContext = createContext();

export class Router extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: '',
            location: getDOMLocation()
        };

        props.history.listen(({ action, location }) => {
            this.setState({
                location,
                action
            });
        });
    }

    render() {
        const contextValue = {
            history: this.props.history,
            location: this.state.location
        }
        return <RouterContext.Provider value={contextValue}>
            {this.props.children}
        </RouterContext.Provider>
    }
}

export class BrowserRouter extends Component {
    constructor(...args) {
        super(...args);
        this.history = createBrowserHistory();
    }

    render() {
        return <Router history={this.history}>
            {this.props.children}
        </Router>
    }

}

export class Switch extends Component {

}

const matcher = (pathname, location) => {
    return (new RegExp(pathname)).exec(location.pathname);
}

export class Route extends Component {
    static contextType = RouterContext;
    render() {
        console.log(':::::::  ', this.context, this.props);
        const DynamicComponent = this.props.component;
        let match = matcher(this.props.path, this.context.location);
        return <>
            {match ? <DynamicComponent {...this.context} /> : null}
        </>
    }
}

export class Link extends Component {
    static contextType = RouterContext;

    render() {
        this.context
        return <a onClick={this.navigateTo.bind(this)}>
            {this.props.children}
        </a>
    }

    navigateTo() {
        console.log('this.con:::', this.context);
    }
}