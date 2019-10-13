/**
 * @file 自己的react-redux
 * @author  changan
 */

import React, { Component } from 'react';


const createContext = () => {
    return React.createContext(null);
}

const reduxContext = createContext();

/**
 * Provider外层组件获取store
 */
export class Provider extends Component {
    render() {
        const store = this.props.store;
        return <reduxContext.Provider value={store}>
            {this.props.children}
        </reduxContext.Provider>
    }
}


/**
 * 连接器方法接受映射方法，返回HOC
 * @param {Function} mapStateToProps 
 * @param {Funection} mapDispatchToProps 
 * @param {Component} ConnectComponent
 * 
 * @returns 装饰后的方法
 */
export const connect = (mapStateToProps, mapDispatchToProps) => {
    return (ConnectComponent) => {
        return class extends Component {
            constructor(props) {
                super(props);
                this.state = {
                    mergedProps: null
                };
            }

            componentDidMount() {
                const store = this.context;
                store.subscribe(() => {
                    const mergedProps = this.computeProps(store);
                    this.setState({
                        mergedProps
                    });
                });
            }
            static contextType = reduxContext;

            computeProps(store) {
                const stateProps = mapStateToProps(store.getState());
                const eventProps = mapDispatchToProps((...args) => store.dispatch(...args));
                return { ...stateProps, ...eventProps };
            }

            render() {
                const mergeProps = this.computeProps(this.context);
                return (<ConnectComponent {...mergeProps} />);
            }
        }
    }
}