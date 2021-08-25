import React from 'react'

function SidebarOption({ active, text, Icon }) {
    return (
        <div className={`sidebarOption ${active && 'sidebarOption--active'}`}>
            <Icon />
            <a href="/search">{ text }</a>
        </div>
    )
}

export default SidebarOption;
