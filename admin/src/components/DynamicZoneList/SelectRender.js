/**
 *
 * List
 *
 */

/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import ComponentList from '../ComponentList';
import ListRow from '../ListRow'
import DynamicZoneList from '../DynamicZoneList'

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

function SelectRender({
    isMain,
    item,
    contentTypes,
    components,
    selectedRows,
    updateSelectedRows
}) {
    let value
    const { type, name } = item;
    value = (typeof selectedRows.populate !== "undefined" && typeof selectedRows.populate[name] !== "undefined")
    console.log(value)
    const setValue = (value) => {
        if (value == true) {
            if (typeof selectedRows.populate == "undefined") {
                selectedRows.populate = {}
            }
            selectedRows.populate[name] = {}
            updateSelectedRows()
        } else if (typeof selectedRows.populate !== "undefined" && typeof selectedRows.populate[name] !== "undefined") {
            delete selectedRows.populate[name]
            if (selectedRows.populate.length === 0) {
                delete selectedRows.populate
            }
            updateSelectedRows()
        }
    }
    if (value === false) {
        return (
            <React.Fragment key={name}>
                <ListRow
                    {...item}
                    isMain={isMain}
                    value={value}
                    setValue={setValue}
                />
            </React.Fragment>
        );
    }
    return (
        <React.Fragment key={name}>
            <ListRow
                {...item}
                isMain={isMain}
                value={value}
                setValue={setValue}
            />

            {type === 'component' && (
                <ComponentList
                    {...item}
                    targetUid={item.component}
                    contentTypes={contentTypes}
                    components={components}
                    selectedRows={selectedRows.populate[name]}
                    updateSelectedRows={updateSelectedRows}
                />
            )}
        </React.Fragment>
    )
}

export default SelectRender;
