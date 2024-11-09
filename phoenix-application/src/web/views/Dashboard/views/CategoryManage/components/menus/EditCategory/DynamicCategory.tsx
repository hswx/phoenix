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
import QueryBuilder, { defaultOperators, Field, RuleGroupTypeIC } from 'react-querybuilder';
import { Cuisine, Flavor } from '../../../../../../../utils/constants';
import { ClassNames } from '@emotion/react';

const muiComponents = {
  Button: (props: {[key: string]: any}) => <Button {...props} color="primary" sx={{alignSelf: "flex-start"}}/>,
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
      {value: Cuisine.CHUAN_CAI, name: "川菜", label: "川菜"},
      {value: Cuisine.HUI_CAI, name: "徽菜", label: "徽菜"},
      {value: Cuisine.LU_CAI, name: "鲁菜", label: "鲁菜"},
      {value: Cuisine.MIN_CAI, name: "闽菜", label: "闽菜"},
      {value: Cuisine.SU_CAI, name: "苏菜", label: "苏菜"},
      {value: Cuisine.XIANG_CAI, name: "湘菜", label: "湘菜"},
      {value: Cuisine.YUE_CAI, name: "粤菜", label: "粤菜"},
      {value: Cuisine.ZHE_CAI, name: "浙菜", label: "粤菜"},
    ],
  },
  {
    name: 'flavor',
    label: '口味',
    valueEditorType: 'multiselect',
    operators: defaultOperators.filter((op) => op.name === 'in' || op.name === 'notIn'),
    values: [
      {value: Flavor.SOUR, name: "酸", label: "酸"},
      {value: Flavor.SWEET, name: "甜", label: "甜"},
      {value: Flavor.SPICY, name: "辣", label: "辣"},
    ],
  },
  {
    name: 'price',
    label: '价格',
    operators: defaultOperators.filter((op) => ["=", "!=", "<", ">", "<=", ">=", "between", "notBetween"].includes(op.name)),
    inputType: 'number'
  },
  {
    name: 'created_at',
    label: '创建时间',
    inputType: 'datetime-local',
    operators: defaultOperators.filter((op) => !["contains", "beginsWith", "endsWith", "doesNotContain", "doesNotBeginWith", "doesNotEndWith", "null", "notNull", "in", "notIn"].includes(op.name)),
  }
] as Field[]

type DynamicCategoryProps = {
  query: RuleGroupTypeIC;
  setQuery: (query: RuleGroupTypeIC) => void;
}

const DynamicCategory = (props: DynamicCategoryProps) => {
  return <QueryBuilderMaterial muiComponents={muiComponents}>
    <ClassNames>
      {({ css }) => <QueryBuilder
        fields={fields}
        query={props.query}
        onQueryChange={props.setQuery}
        independentCombinators={true}
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
