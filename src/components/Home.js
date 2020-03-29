import React, { useEffect, useState } from 'react';

import DisplayPage from "./displayPage.js"

const Home = props => {
    return (
        <DisplayPage notesLocation="notes" location="home"></DisplayPage>
    )
}

export default Home