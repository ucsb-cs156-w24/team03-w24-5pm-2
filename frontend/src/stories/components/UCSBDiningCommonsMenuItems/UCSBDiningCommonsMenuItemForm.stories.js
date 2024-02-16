import React from 'react';
import UCSBDiningCommonsMenuItemsTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemsTable";
import { ucsbDiningCommonsMenuItemFixtures } from 'fixtures/ucsbDiningCommonsMenuItemFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable',
    component: UCSBDiningCommonsMenuItemsTable
};

const Template = (args) => {
    return (
        <UCSBDiningCommonsMenuItemsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    items: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    items: ucsbDiningCommonsMenuItemFixtures.threeItems,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    items: ucsbDiningCommonsMenuItemFixtures.threeItems,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/ucsbdiningcommonsmenuitems', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

