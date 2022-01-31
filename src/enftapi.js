const ENFT_API_URL = "https://absole.io:4001"

export async function getSections(galleryName) {
  return await fetch(ENFT_API_URL + '/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
          query{
              gallerySections(id: "${galleryName}"){
                sectionId
                title
                description
                items{
                  tokenId
                  src
                  name
                  description
                }
              }
          }
        `,
      variables: {
      },
    }),
  })
    .then((res) => res.json())
    .then((resp) => resp.data ? resp.data.gallerySections.map(s => {
      s.id = s.sectionId;
      delete s.sectionId;
      s.title = s.title ? s.title : "";
      s.description = s.description ? s.description : "";
      s.items.forEach(t => { t.id = t.tokenId });
      return s;
    }) : null)
}

export async function getGalleryName(bearer) {
  if (!bearer) return null;
  return await fetch(ENFT_API_URL + '/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + bearer,
    },
    body: JSON.stringify({
      query: `
          query{
              userGalleries{
                name
              }
          }
        `,
      variables: {
      },
    }),
  })
    .then((res) => res.json())
    .then((resp) => resp.data && resp.data.userGalleries[0] ? resp.data.userGalleries[0].name : null)
}
export async function isNameAvailable(name) {
  return await fetch(ENFT_API_URL + '/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
          query{
            galleryAvailable(id: "${name}")
          }
        `,
    }),
  })
    .then((res) => res.json())
    .then((resp) => resp.data ? resp.data.galleryAvailable : null)
}

export async function laodGalleryByName(galleryName) {
  return await fetch(ENFT_API_URL + '/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
              query{
                galleryByName(name: "${galleryName}"){
                  name
                  description
                  tokenId
                  realName
                  twitter
                  instagram
                  homepage
                  auctionhouse
                  deviantart
                  addresses
                }
              }
            `,
      variables: {
      },
    }),
  })
    .then((res) => res.json())
    .then((resp) => resp.data ? resp.data.galleryByName : null)
}

export async function registerGalleryName(opts /*{ galleryName, bearer}*/) {

  return await fetch(ENFT_API_URL + '/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + opts.bearer,
    },
    body: JSON.stringify({
      query: `
              mutation{
                  createGallery(name: "${opts.galleryName}"){
                    name
                  }
              }
            `,
      variables: {
      },
    }),
  })
    .then((res) => res.json())
    .then((resp) => resp.data ? resp.data.createGallery.name : null)
}
export async function loadMemberTokenIds() {
  return await fetch(ENFT_API_URL + '/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
              query{
                  allMemberNfts{
                  tokenId
                  }
              }
            `,
      variables: {
      },
    }),
  })
    .then((res) => res.json())
    .then((resp) => resp.data.allMemberNfts.map(obj => obj.tokenId))
}

export async function nftlogin(tokenId, txProof) {
  console.log(JSON.stringify({
    tokenId,
    txProof
  }))
  return await fetch(ENFT_API_URL + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tokenId,
      txProof
    }),
  })
    .then((res) => {
      return res.status == 200 ? res.text() : null
    })
}

export async function getMintedTokens(bearer) {
  return await fetch(ENFT_API_URL + '/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + bearer,
    },
    body: JSON.stringify({
      query: `
                  query{
                    mintedTokens{
                        tokenId
                        url
                        name
                        description
                    }
                }
            `,
      variables: {
      },
    }),
  })
    .then((res) => res.json())
    .then((resp) => resp.data ? resp.data.mintedTokens.map(t => { t.id = t.tokenId; t.src = t.url; return t; }) : [])
}

// {file, bearer}
export async function uploadAvatar(opts) {
  const query = "mutation { upload_profile_picture(picture: \"picture\")}"

  const formData = new FormData()
  formData.append("query", query)
  formData.append("picture", opts.file, opts.file.name)

  return await fetch(ENFT_API_URL + '/api', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + opts.bearer,
    },
    body: formData
  })
    .then((res) => res.ok)
}
