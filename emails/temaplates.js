exports.confirmEmail = (link) => {
    return `Welcome

Please confirm your email address by clicking on this link: 
    
`+link+` 

Cheers

Your friends at Smart City`
}

exports.availOffer = (offer, brand) => {
    return `Congratulations

You have availed:

`+offer+` from ` + brand +`
    
Use this coupon 23233xkc at the place.

Cheers

Your friends at Smart City`
}