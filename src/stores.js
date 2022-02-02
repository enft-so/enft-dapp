import { writable } from 'svelte/store';
import { nanoid } from 'nanoid';
import {loadPicturesFromAddress} from './auctions';
import {getSections, getMintedTokens} from './enftapi';

import { Socket } from "phoenix";
const SOCKET_URL = "wss://absole.io:4001/socket";


export const gallery = createMutableGallery();
export const user = createUiState();

function createMutableGallery() {
    let stashSample = {
        id: "stash",
        title: "",
        description: "",
        items: [
        ],
    }

    function sendGalleryUpdate(gallery, action, data){
        try{
            const channel = gallery.socket.channels.find(c => c.topic == 'gallery:'+gallery.galleryName);
            if(channel){
                channel.push("new_msg", {action, body: data}, 10000);
            }
        }finally{
            return gallery;
        }
    }

    const section = {
        id: nanoid(),
        title: "",
        description: "",
        items: []
    }
    const galleryStore = {
        //tokenId: null,
        tokenId: null,
        ownGallery: null,
        addresses: [],
        realName:"",
        galleryName:"",
        galleryDescription: "",
        twitter:null,
        instagram:null,
        homepage:null,
        auctionhouse:null,
        deviantart:null,
        stash: stashSample,
        sections: [section]
    };
	const { subscribe, set, update } = writable(galleryStore);

    function handleSocketMessage(msg){
        //console.log("incoming message:")
        //console.log(msg)
        if( "update_sections" == msg.action){
            try{
                const sections = JSON.parse(msg.body);
                update(g => {
                    g.sections = sections
                    return g;
                })
            }catch(e){
                console.error("invalid message", msg);
            }
        }
        if( "section_title" == msg.action){
            update(g => {
                const section = g.sections.find(s => s.id == msg.sectionId);
                if(section){
                    section.title = msg.title;
                }
                return g;
            })
        }
        if( "section_description" == msg.action){
            update(g => {
                const section = g.sections.find(s => s.id == msg.sectionId);
                if(section){
                    section.description = msg.description;
                }
                return g;
            })
        }
        if( "gallery_description" == msg.action){
            update(g => {
                g.galleryDescription = msg.galleryDescription;
                return g;
            })
        }

        return msg
    }

	return {
        // API - sockets
        initSocket: () => {
            const socket = new Socket(SOCKET_URL, {});
            socket.connect();
            update(g => {
                g.socket = socket;
                return g;
            })

        },
        // state changes initiated by UI
		subscribe,
        update,
        joinChannel: (topic, token) =>{
            update(g => {
                try{
                    const prevChannel = g.socket.channels.find(c => c.topic.includes("gallery:"));
                    if(prevChannel){ 
                        prevChannel.leave();
                    }
                    const channel = g.socket.channel(topic, { token});
                    channel.on("new_msg", handleSocketMessage);
                    channel.join();
                }finally{
                    return g;
                }
            })
        },
		updateSections: (sections) => update(g => {
            //console.log("updateSections");
            g.sections = [...sections]
            try{
                //console.log("send new sections message");
                //console.log(sections);
                const channel = g.socket.channels.find(c => c.topic == 'gallery:'+g.galleryName);
                if(channel){
                    channel.push("new_msg", {action: "update_sections",body: JSON.stringify(sections)}, 10000);
                }
            }finally{
                return g;
            }
        }),
        updateSectionTitle: (sectionId, title) => update(g =>{
            const section = g.sections.find(s => s.id == sectionId);
            if(section){
                section.title = title;
                try{
                    const channel = g.socket.channels.find(c => c.topic == 'gallery:'+g.galleryName);
                    if(channel){
                        channel.push("new_msg", {action: "section_title", sectionId, title}, 10000);
                    }
                }finally{
                    return g;
                }
            }
            return g;
        }),
        updateSectionDescription: (sectionId, description) => update(g =>{
            const section = g.sections.find(s => s.id == sectionId);
            if(section){
                section.description = description;
                try{
                    const channel = g.socket.channels.find(c => c.topic == 'gallery:'+g.galleryName);
                    if(channel){
                        channel.push("new_msg", {action: "section_description", sectionId, description}, 10000);
                    }
                }finally{
                    return g;
                }
            }
            return g;
        }),
		updateStashItems: (items) => update(g => {
            g.stash.items = items; 
            return g;
        }),
        setAddresses: (addresses) => update(g =>{
            g.addresses = addresses ? addresses : [];
            return g;
        }),
        setName: (galleryName) => update(g =>{
            g.galleryName = galleryName;
            return g;
        }),
        setOwnGallery: (galleryName) => update(g =>{
            g.ownGallery = galleryName;
            return g;
        }),
        setRealName: (realName) => update(g =>{
            g.realName = realName;
            return sendGalleryUpdate(g, "real_name",  realName);
        }),
        setDescription: (galleryDescription) => update(g =>{
            g.galleryDescription = galleryDescription;
            try{
                const channel = g.socket.channels.find(c => c.topic == 'gallery:'+g.galleryName);
                if(channel){
                    channel.push("new_msg", {action: "gallery_description", galleryDescription}, 10000);
                }
            }finally{
                return g;
            }
        }),
        setTwitter: (twitter) => update(g =>{
            g.twitter = twitter;
            return sendGalleryUpdate(g, "social_link", {platform:"twitter", url: twitter});
        }),
        setInstagram: (instagram) => update(g =>{
            g.instagram = instagram;
            return sendGalleryUpdate(g, "social_link",  {platform:"instagram", url: instagram});
        }),
        setHomepage: (homepage) => update(g =>{
            g.homepage = homepage;
            return sendGalleryUpdate(g, "social_link",  {platform:"homepage", url: homepage});
        }),
        setErgoAuctionhouse: (auctionhouse) => update(g =>{
            g.auctionhouse = auctionhouse;
            return sendGalleryUpdate(g, "social_link",  {platform:"auctionhouse", url: auctionhouse});
        }),
        setDeviantArt: (deviantart) => update(g =>{
            g.deviantart = deviantart;
            return sendGalleryUpdate(g, "social_link",  {platform:"deviantart", url: deviantart});
        }),
		set: (g) => set(g),

        // API integration
        loadGallery: async(name) => {
            const sections  = await getSections(name);
            update(g=>{
                g.sections = sections
                return g;
            })
            return gallery;
        },
        loadGalleryWithStashItems: async(bearer, name, addressList) => {
            const sections  = await getSections(name);
            const sectionNftIds = sections.map(s => s.items).flat().map(t => t.tokenId);

            let mintedTokens = await getMintedTokens(bearer)
            let stashNfts = []

            for (const address of addressList) {
                stashNfts = [...stashNfts, ...await loadPicturesFromAddress(address)]
            }
            stashNfts = [...stashNfts.filter(t => !mintedTokens.some(tok => tok.tokenId == t.tokenId)), ...mintedTokens]
            const filteredStash = stashNfts.filter(t => sectionNftIds.indexOf(t.tokenId) < 0 );

            update(g=>{
                g.stash.items = filteredStash
                g.sections = sections
                return g;
            })
            return gallery;
        },
	};
}

function createUiState(){
    const baseStore = {
        bearer: localStorage.getItem('enft_bearer'),
    }

    const { subscribe, set, update } = writable(baseStore);
    return {
        subscribe, 
        set, 
        update,
        setBearer: (bearer) =>update( u =>
            {
                u.bearer = bearer;
                localStorage.setItem('enft_bearer', bearer);
                return u;
        }),
        signout:()=> update( u =>
            {
                u.bearer = null;
                localStorage.removeItem('enft_bearer');
                return u;
        }),

    }
}
