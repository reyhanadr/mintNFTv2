const baseURL = 'demo-mint-nft.reyhanadr.com'

// default customization applied to the HTML in the main layout.tsx
const style = {
    theme:       'light',        // dark | light
    neutral:     'slate',        // sand | gray | slate
    brand:       'custom',        // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
    accent:      'custom',      // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
    solid:       'color',    // color | contrast
    solidStyle:  'plastic',        // flat | plastic
    border:      'playful',     // rounded | playful | conservative
    surface:     'filled', // filled | translucent
    transition:  'all',         // all | micro | macro
    scaling:     '100',         // 90 | 95 | 100 | 105 | 110
}

// default metadata
const meta = {
    title: 'Minting NFT on Ethereum Sepolia',
    description: '"MintMate", a website dedicated to creating and minting NFTs.'
}


// default open graph data
const og = {
    title: 'Minting NFT on Ethereum Sepolia',
    description: '"MintMate", a website dedicated to creating and minting NFTs.',
    type: 'website'
}

// default schema data
const schema = {
    logo: '/images/trademark/iconR.svg',
    type: 'Organization',
    name: 'Minting NFT',
    description: '"MintMate", a website dedicated to creating and minting NFTs.',
    email: 'reyhanadr@outlook.com'
}

// social links
const social = {
    twitter: 'https://www.twitter.com/_onceui',
    linkedin: 'https://www.linkedin.com/company/once-ui/',
    discord: 'https://discord.com/invite/5EyAQ4eNdS'
}

export { baseURL, style, meta, og, schema, social };