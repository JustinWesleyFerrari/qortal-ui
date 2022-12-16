import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'

import '@material/mwc-icon'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatHead extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            chatInfo: { type: Object },
            iconName: { type: String },
            activeChatHeadUrl: { type: String }
        }
    }

    static get styles() {
        return css`
            li {
                padding: 10px 2px 20px 5px;
                cursor: pointer;
                width: 100%;
            }

            li:hover {
                background-color: var(--menuhover);
            }

            .active {
                background: var(--menuactive);
                border-left: 4px solid #3498db;
            }

            .img-icon {
                float: left;
                font-size:40px;
                color: var(--black);
            }

            .about {
                margin-top: 8px;
            }

            .about {
                padding-left: 8px;
            }

            .status {
                color: #92959e;
            }

            .clearfix:after {
                visibility: hidden;
                display: block;
                font-size: 0;
                content: " ";
                clear: both;
                height: 0;
            }
        `
    }

    constructor() {
        super()
        this.selectedAddress = {}
        this.config = {
            user: {
                node: {

                }
            }
        }
        this.chatInfo = {}
        this.iconName = ''
        this.activeChatHeadUrl = ''
    }

    render() {
        return html`
            <li @click=${() => this.getUrl(this.chatInfo.url)} class="clearfix ${this.activeChatHeadUrl === this.chatInfo.url ? 'active' : ''}">
                <mwc-icon class="img-icon">account_circle</mwc-icon>
                <div class="about">
                    <div class="name"><span style="float:left; padding-left: 8px; color: var(--black);">${this.chatInfo.groupName ? this.chatInfo.groupName : this.chatInfo.name !== undefined ? this.chatInfo.name : this.chatInfo.address.substr(0, 15)} </span> <mwc-icon style="float:right; padding: 0 1rem; color: var(--black);">${this.chatInfo.groupId !== undefined ? 'lock_open' : 'lock'}</mwc-icon> </div>
                </div>
            </li>
        `
    }

    firstUpdated() {
        let configLoaded = false
        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
            parentEpml.subscribe('config', c => {
                if (!configLoaded) {
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
        })
        parentEpml.imReady()
    }

    getUrl(chatUrl) {
        this.onPageNavigation(`/app/q-chat/${chatUrl}`)
    }

    onPageNavigation(pageUrl) {
        parentEpml.request('setPageUrl', pageUrl)
    }
}

window.customElements.define('chat-head', ChatHead)
