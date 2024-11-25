import React from 'react';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import {
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  DragIndicator,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from '@mui/icons-material';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  ListSubheader,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextareaAutosize,
  GlobalStyles,
} from '@mui/material';
import QueryBuilder, { defaultOperators } from 'react-querybuilder';
import { CUISINE, FLAVOR } from '../../../../../../../utils/constants';
import { ClassNames } from '@emotion/react';

const muiComponents = {
  Button: (props) => <Button {...props} color="primary" sx={{alignSelf: "flex-start"}}/>,
  Checkbox,
  CloseIcon,
  ContentCopyIcon,
  DragIndicator,
  FormControl,
  FormControlLabel,
  Input, 
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  ListSubheader,
  LockIcon,
  LockOpenIcon,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextareaAutosize,
};
const fields = [
  {
    name: 'name',
    label: '菜品名称',
    operators: defaultOperators.filter((op) => !["<", ">", "<=", ">=", "null", "notNull", "between", "notBetween"].includes(op.name)),
  },
  {
    name: 'cuisine',
    label: '菜系',
    valueEditorType: 'select',
    operators: defaultOperators.filter((op) => op.name === '=' || op.name === '!='),
    values: [
      {name: CUISINE.CHUAN_CAI, label: "川菜"},
      {name: CUISINE.HUI_CAI, label: "徽菜"},
      {name: CUISINE.LU_CAI, label: "鲁菜"},
      {name: CUISINE.MIN_CAI, label: "闽菜"},
      {name: CUISINE.SU_CAI, label: "苏菜"},
      {name: CUISINE.XIANG_CAI, label: "湘菜"},
      {name: CUISINE.YUE_CAI, label: "粤菜"},
      {name: CUISINE.ZHE_CAI, label: "粤菜"},
    ],
  },
  {
    name: 'flavor',
    label: '口味',
    valueEditorType: 'select',
    operators: defaultOperators.filter((op) => op.name === 'contains' || op.name === 'doesNotContain'),
    values: [
      {name: FLAVOR.SOUR, label: "酸"},
      {name: FLAVOR.SWEET, label: "甜"},
      {name: FLAVOR.SPICY, label: "辣"},
    ],
  },
  {
    name: 'price',
    label: '价格',
    operators: defaultOperators.filter((op) => ["=", "!=", "<", ">", "<=", ">=", "between", "notBetween"].includes(op.name)),
    inputType: 'number'
  },
  // {
  //   name: 'created_at',
  //   label: '创建时间',
  //   inputType: 'datetime-local',
  //   operators: defaultOperators.filter((op) => !["contains", "beginsWith", "endsWith", "doesNotContain", "doesNotBeginWith", "doesNotEndWith", "null", "notNull", "in", "notIn"].includes(op.name)),
  // }
]

const DynamicCategory = (props) => {
  return <QueryBuilderMaterial muiComponents={muiComponents}>
    <ClassNames>
      {({ css }) => <QueryBuilder
        fields={fields}
        query={props.query}
        onQueryChange={props.setQuery}
        independentCombinators={true}
        parseNumbers={true}
        controlClassnames={{
          body: css`
            display: flex;
            flex-direction: column;
            row-gap: 8px;
          `,
          rule: css`
            display: flex;
            column-gap: 8px;
          `,
          value: css`
            display: flex;
            flex-direction: column;
          `
        }}
        controlElements={{
          addGroupAction: () => null
        }}
      />}
    </ClassNames>
    <GlobalStyles styles={{ '.ruleGroup': { display: 'flex', flexDirection: 'column', gap: '8px' } }} />
  </QueryBuilderMaterial>
}

export default DynamicCategory
