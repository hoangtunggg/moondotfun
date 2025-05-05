import {BrowserRouter, Routes, Route} from 'react-router-dom'
import React from 'react'
import Home from './Home'
import TokenCreate from './TokenCreate'


const Main = () => {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/token-create" element={<TokenCreate />} />
            </Routes>
        </BrowserRouter>
        </>
    )
}
export default Main         