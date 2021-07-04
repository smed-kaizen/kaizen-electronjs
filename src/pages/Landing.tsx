import React from 'react'
import './Landing.scss'
import logosvg from '../assets/images/Kaizen.gif'

export default function Landing() {
    return (
        <div className='landingContainer'>
            <h1>
                Kaizen
            </h1>
            <img src={logosvg} />
            <div className='descriptionContainer'>
            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti nostrum rem consectetur ea cum et maiores in quos dicta quidem.</h3>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla accusamus similique ullam, tenetur, totam ipsam modi voluptates dolorem quia perspiciatis delectus magni autem assumenda consequuntur odit, soluta voluptate sed earum! Architecto recusandae, iusto, eaque ex consequatur repellat sed asperiores unde consequuntur voluptatum ipsum porro harum esse facilis animi doloremque ipsa. Illo velit, dignissimos iure cum ad placeat tempore sit voluptates, nam veniam distinctio vero quibusdam quis aliquid, blanditiis ex hic natus! Sit, excepturi ducimus, nam assumenda rem dolorem veniam obcaecati autem facere repudiandae suscipit iusto hic libero deleniti consequuntur quam nesciunt iure accusamus voluptas quae. Laborum at tenetur repellat corporis!</p>
            </div>
        </div>
    )
}
