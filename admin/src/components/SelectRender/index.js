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
    if (['component', 'relation', 'dynamiczone'].includes(type)) {
        value = (typeof selectedRows.populate !== "undefined" && typeof selectedRows.populate[name] !== "undefined")
    } else {
        value = (typeof selectedRows.fields !== "undefined" && selectedRows.fields.findIndex((field) => field === name) !== -1)
    }
    const setValue = (value) => {
        if (['component', 'relation', 'dynamiczone'].includes(type)) {
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
        } else {
            if (value == true) {
                if (typeof selectedRows.fields == "undefined") {
                    selectedRows.fields = []
                }
                selectedRows.fields.push(name)
                updateSelectedRows()
            } else if (typeof selectedRows.fields !== "undefined" && selectedRows.fields.findIndex((field) => field === name) !== -1) {
                var index = selectedRows.fields.indexOf(name);
                if (index !== -1) {
                    selectedRows.fields.splice(index, 1);
                }
                if (selectedRows.fields.length === 0) {
                    delete selectedRows.fields
                }
                updateSelectedRows()
            }
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
            {type === 'relation' && (
                <ComponentList
                    {...item}
                    targetUid={item.target}
                    contentTypes={contentTypes}
                    components={components}
                    selectedRows={selectedRows.populate[name]}
                    updateSelectedRows={updateSelectedRows}
                />
            )}

            {type === 'dynamiczone' && (
                <DynamicZoneList
                    item={item}
                    selectedRows={selectedRows.populate[name]}
                    updateSelectedRows={updateSelectedRows}
                    contentTypes={contentTypes}
                    components={components}
                />
            )}
        </React.Fragment>
    )
}

export default SelectRender;
