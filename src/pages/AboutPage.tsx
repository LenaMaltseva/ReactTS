import React from 'react'
import {useHistory} from 'react-router-dom'

const AboutPage: React.FC = () => {
    const history = useHistory()
    return (
        <>
            <h2>Agenda App v.1.0</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                animi corporis eos officiis quas quia sequi sint soluta suscipit
                voluptatibus. Adipisci, aspernatur atque dignissimos, dolorum
                ducimus, ipsa laboriosam minima molestias non odio quas quisquam
                reiciendis temporibus tenetur voluptatum. A accusantium
                corporis, cupiditate dolor dolores eaque esse hic ipsum itaque
                maxime minus neque non odio odit perferendis perspiciatis quam
                quisquam recusandae repudiandae sint sunt vero voluptas? Aut
                eius eligendi, inventore ipsam labore, nam odio quos reiciendis
                ut veritatis voluptas voluptatem voluptates. Cum eos, tempora.
                Earum eligendi omnis provident quaerat quam quas suscipit.
                Aliquam assumenda beatae commodi consectetur corporis cum cumque
                cupiditate dolorum eligendi eos excepturi ipsam iure labore
                libero maiores molestiae necessitatibus nostrum nulla
                perspiciatis quidem reiciendis, sunt ut vel voluptatibus!
            </p>
            <button className='btn mt2' onClick={() => history.push('/')}>
                Go back
            </button>
        </>
    )
}

export default AboutPage
