import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  pricing_enum: { input: any; output: any; }
  smallint: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
  uuid: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "dev.Notification" */
export type Dev_Notification = {
  __typename?: 'dev_Notification';
  Content: Scalars['String']['output'];
  CreatedAt: Scalars['timestamptz']['output'];
  DueDate: Scalars['timestamptz']['output'];
  Id: Scalars['uuid']['output'];
  RememberCount: Scalars['smallint']['output'];
  Subject: Scalars['String']['output'];
  /** An object relationship */
  User: Dev_User;
  UserId: Scalars['uuid']['output'];
};

/** aggregated selection of "dev.Notification" */
export type Dev_Notification_Aggregate = {
  __typename?: 'dev_Notification_aggregate';
  aggregate?: Maybe<Dev_Notification_Aggregate_Fields>;
  nodes: Array<Dev_Notification>;
};

export type Dev_Notification_Aggregate_Bool_Exp = {
  count?: InputMaybe<Dev_Notification_Aggregate_Bool_Exp_Count>;
};

export type Dev_Notification_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Dev_Notification_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Dev_Notification_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "dev.Notification" */
export type Dev_Notification_Aggregate_Fields = {
  __typename?: 'dev_Notification_aggregate_fields';
  avg?: Maybe<Dev_Notification_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Dev_Notification_Max_Fields>;
  min?: Maybe<Dev_Notification_Min_Fields>;
  stddev?: Maybe<Dev_Notification_Stddev_Fields>;
  stddev_pop?: Maybe<Dev_Notification_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Dev_Notification_Stddev_Samp_Fields>;
  sum?: Maybe<Dev_Notification_Sum_Fields>;
  var_pop?: Maybe<Dev_Notification_Var_Pop_Fields>;
  var_samp?: Maybe<Dev_Notification_Var_Samp_Fields>;
  variance?: Maybe<Dev_Notification_Variance_Fields>;
};


/** aggregate fields of "dev.Notification" */
export type Dev_Notification_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Dev_Notification_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "dev.Notification" */
export type Dev_Notification_Aggregate_Order_By = {
  avg?: InputMaybe<Dev_Notification_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Dev_Notification_Max_Order_By>;
  min?: InputMaybe<Dev_Notification_Min_Order_By>;
  stddev?: InputMaybe<Dev_Notification_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Dev_Notification_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Dev_Notification_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Dev_Notification_Sum_Order_By>;
  var_pop?: InputMaybe<Dev_Notification_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Dev_Notification_Var_Samp_Order_By>;
  variance?: InputMaybe<Dev_Notification_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "dev.Notification" */
export type Dev_Notification_Arr_Rel_Insert_Input = {
  data: Array<Dev_Notification_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Dev_Notification_On_Conflict>;
};

/** aggregate avg on columns */
export type Dev_Notification_Avg_Fields = {
  __typename?: 'dev_Notification_avg_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "dev.Notification" */
export type Dev_Notification_Avg_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "dev.Notification". All fields are combined with a logical 'AND'. */
export type Dev_Notification_Bool_Exp = {
  Content?: InputMaybe<String_Comparison_Exp>;
  CreatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  DueDate?: InputMaybe<Timestamptz_Comparison_Exp>;
  Id?: InputMaybe<Uuid_Comparison_Exp>;
  RememberCount?: InputMaybe<Smallint_Comparison_Exp>;
  Subject?: InputMaybe<String_Comparison_Exp>;
  User?: InputMaybe<Dev_User_Bool_Exp>;
  UserId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Dev_Notification_Bool_Exp>>;
  _not?: InputMaybe<Dev_Notification_Bool_Exp>;
  _or?: InputMaybe<Array<Dev_Notification_Bool_Exp>>;
};

/** unique or primary key constraints on table "dev.Notification" */
export enum Dev_Notification_Constraint {
  /** unique or primary key constraint on columns "Id" */
  NotificationPkey = 'Notification_pkey'
}

/** input type for incrementing numeric columns in table "dev.Notification" */
export type Dev_Notification_Inc_Input = {
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
};

/** input type for inserting data into table "dev.Notification" */
export type Dev_Notification_Insert_Input = {
  Content?: InputMaybe<Scalars['String']['input']>;
  CreatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  DueDate?: InputMaybe<Scalars['timestamptz']['input']>;
  Id?: InputMaybe<Scalars['uuid']['input']>;
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
  Subject?: InputMaybe<Scalars['String']['input']>;
  User?: InputMaybe<Dev_User_Obj_Rel_Insert_Input>;
  UserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Dev_Notification_Max_Fields = {
  __typename?: 'dev_Notification_max_fields';
  Content?: Maybe<Scalars['String']['output']>;
  CreatedAt?: Maybe<Scalars['timestamptz']['output']>;
  DueDate?: Maybe<Scalars['timestamptz']['output']>;
  Id?: Maybe<Scalars['uuid']['output']>;
  RememberCount?: Maybe<Scalars['smallint']['output']>;
  Subject?: Maybe<Scalars['String']['output']>;
  UserId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "dev.Notification" */
export type Dev_Notification_Max_Order_By = {
  Content?: InputMaybe<Order_By>;
  CreatedAt?: InputMaybe<Order_By>;
  DueDate?: InputMaybe<Order_By>;
  Id?: InputMaybe<Order_By>;
  RememberCount?: InputMaybe<Order_By>;
  Subject?: InputMaybe<Order_By>;
  UserId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Dev_Notification_Min_Fields = {
  __typename?: 'dev_Notification_min_fields';
  Content?: Maybe<Scalars['String']['output']>;
  CreatedAt?: Maybe<Scalars['timestamptz']['output']>;
  DueDate?: Maybe<Scalars['timestamptz']['output']>;
  Id?: Maybe<Scalars['uuid']['output']>;
  RememberCount?: Maybe<Scalars['smallint']['output']>;
  Subject?: Maybe<Scalars['String']['output']>;
  UserId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "dev.Notification" */
export type Dev_Notification_Min_Order_By = {
  Content?: InputMaybe<Order_By>;
  CreatedAt?: InputMaybe<Order_By>;
  DueDate?: InputMaybe<Order_By>;
  Id?: InputMaybe<Order_By>;
  RememberCount?: InputMaybe<Order_By>;
  Subject?: InputMaybe<Order_By>;
  UserId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "dev.Notification" */
export type Dev_Notification_Mutation_Response = {
  __typename?: 'dev_Notification_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Dev_Notification>;
};

/** on_conflict condition type for table "dev.Notification" */
export type Dev_Notification_On_Conflict = {
  constraint: Dev_Notification_Constraint;
  update_columns?: Array<Dev_Notification_Update_Column>;
  where?: InputMaybe<Dev_Notification_Bool_Exp>;
};

/** Ordering options when selecting data from "dev.Notification". */
export type Dev_Notification_Order_By = {
  Content?: InputMaybe<Order_By>;
  CreatedAt?: InputMaybe<Order_By>;
  DueDate?: InputMaybe<Order_By>;
  Id?: InputMaybe<Order_By>;
  RememberCount?: InputMaybe<Order_By>;
  Subject?: InputMaybe<Order_By>;
  User?: InputMaybe<Dev_User_Order_By>;
  UserId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: dev.Notification */
export type Dev_Notification_Pk_Columns_Input = {
  Id: Scalars['uuid']['input'];
};

/** select columns of table "dev.Notification" */
export enum Dev_Notification_Select_Column {
  /** column name */
  Content = 'Content',
  /** column name */
  CreatedAt = 'CreatedAt',
  /** column name */
  DueDate = 'DueDate',
  /** column name */
  Id = 'Id',
  /** column name */
  RememberCount = 'RememberCount',
  /** column name */
  Subject = 'Subject',
  /** column name */
  UserId = 'UserId'
}

/** input type for updating data in table "dev.Notification" */
export type Dev_Notification_Set_Input = {
  Content?: InputMaybe<Scalars['String']['input']>;
  CreatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  DueDate?: InputMaybe<Scalars['timestamptz']['input']>;
  Id?: InputMaybe<Scalars['uuid']['input']>;
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
  Subject?: InputMaybe<Scalars['String']['input']>;
  UserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Dev_Notification_Stddev_Fields = {
  __typename?: 'dev_Notification_stddev_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "dev.Notification" */
export type Dev_Notification_Stddev_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Dev_Notification_Stddev_Pop_Fields = {
  __typename?: 'dev_Notification_stddev_pop_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "dev.Notification" */
export type Dev_Notification_Stddev_Pop_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Dev_Notification_Stddev_Samp_Fields = {
  __typename?: 'dev_Notification_stddev_samp_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "dev.Notification" */
export type Dev_Notification_Stddev_Samp_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "dev_Notification" */
export type Dev_Notification_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dev_Notification_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dev_Notification_Stream_Cursor_Value_Input = {
  Content?: InputMaybe<Scalars['String']['input']>;
  CreatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  DueDate?: InputMaybe<Scalars['timestamptz']['input']>;
  Id?: InputMaybe<Scalars['uuid']['input']>;
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
  Subject?: InputMaybe<Scalars['String']['input']>;
  UserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Dev_Notification_Sum_Fields = {
  __typename?: 'dev_Notification_sum_fields';
  RememberCount?: Maybe<Scalars['smallint']['output']>;
};

/** order by sum() on columns of table "dev.Notification" */
export type Dev_Notification_Sum_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** update columns of table "dev.Notification" */
export enum Dev_Notification_Update_Column {
  /** column name */
  Content = 'Content',
  /** column name */
  CreatedAt = 'CreatedAt',
  /** column name */
  DueDate = 'DueDate',
  /** column name */
  Id = 'Id',
  /** column name */
  RememberCount = 'RememberCount',
  /** column name */
  Subject = 'Subject',
  /** column name */
  UserId = 'UserId'
}

export type Dev_Notification_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Dev_Notification_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Dev_Notification_Set_Input>;
  /** filter the rows which have to be updated */
  where: Dev_Notification_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Dev_Notification_Var_Pop_Fields = {
  __typename?: 'dev_Notification_var_pop_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "dev.Notification" */
export type Dev_Notification_Var_Pop_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Dev_Notification_Var_Samp_Fields = {
  __typename?: 'dev_Notification_var_samp_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "dev.Notification" */
export type Dev_Notification_Var_Samp_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Dev_Notification_Variance_Fields = {
  __typename?: 'dev_Notification_variance_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "dev.Notification" */
export type Dev_Notification_Variance_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** columns and relationships of "dev.User" */
export type Dev_User = {
  __typename?: 'dev_User';
  Id: Scalars['uuid']['output'];
  Mail: Scalars['String']['output'];
  Name: Scalars['String']['output'];
  /** An array relationship */
  Notifications: Array<Dev_Notification>;
  /** An aggregate relationship */
  Notifications_aggregate: Dev_Notification_Aggregate;
  Pricing?: Maybe<Scalars['pricing_enum']['output']>;
};


/** columns and relationships of "dev.User" */
export type Dev_UserNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Dev_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_Notification_Order_By>>;
  where?: InputMaybe<Dev_Notification_Bool_Exp>;
};


/** columns and relationships of "dev.User" */
export type Dev_UserNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dev_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_Notification_Order_By>>;
  where?: InputMaybe<Dev_Notification_Bool_Exp>;
};

/** aggregated selection of "dev.User" */
export type Dev_User_Aggregate = {
  __typename?: 'dev_User_aggregate';
  aggregate?: Maybe<Dev_User_Aggregate_Fields>;
  nodes: Array<Dev_User>;
};

/** aggregate fields of "dev.User" */
export type Dev_User_Aggregate_Fields = {
  __typename?: 'dev_User_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Dev_User_Max_Fields>;
  min?: Maybe<Dev_User_Min_Fields>;
};


/** aggregate fields of "dev.User" */
export type Dev_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Dev_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "dev.User". All fields are combined with a logical 'AND'. */
export type Dev_User_Bool_Exp = {
  Id?: InputMaybe<Uuid_Comparison_Exp>;
  Mail?: InputMaybe<String_Comparison_Exp>;
  Name?: InputMaybe<String_Comparison_Exp>;
  Notifications?: InputMaybe<Dev_Notification_Bool_Exp>;
  Notifications_aggregate?: InputMaybe<Dev_Notification_Aggregate_Bool_Exp>;
  Pricing?: InputMaybe<Pricing_Enum_Comparison_Exp>;
  _and?: InputMaybe<Array<Dev_User_Bool_Exp>>;
  _not?: InputMaybe<Dev_User_Bool_Exp>;
  _or?: InputMaybe<Array<Dev_User_Bool_Exp>>;
};

/** unique or primary key constraints on table "dev.User" */
export enum Dev_User_Constraint {
  /** unique or primary key constraint on columns "Id" */
  UserPkey = 'User_pkey'
}

/** input type for inserting data into table "dev.User" */
export type Dev_User_Insert_Input = {
  Id?: InputMaybe<Scalars['uuid']['input']>;
  Mail?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Notifications?: InputMaybe<Dev_Notification_Arr_Rel_Insert_Input>;
  Pricing?: InputMaybe<Scalars['pricing_enum']['input']>;
};

/** aggregate max on columns */
export type Dev_User_Max_Fields = {
  __typename?: 'dev_User_max_fields';
  Id?: Maybe<Scalars['uuid']['output']>;
  Mail?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  Pricing?: Maybe<Scalars['pricing_enum']['output']>;
};

/** aggregate min on columns */
export type Dev_User_Min_Fields = {
  __typename?: 'dev_User_min_fields';
  Id?: Maybe<Scalars['uuid']['output']>;
  Mail?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  Pricing?: Maybe<Scalars['pricing_enum']['output']>;
};

/** response of any mutation on the table "dev.User" */
export type Dev_User_Mutation_Response = {
  __typename?: 'dev_User_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Dev_User>;
};

/** input type for inserting object relation for remote table "dev.User" */
export type Dev_User_Obj_Rel_Insert_Input = {
  data: Dev_User_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Dev_User_On_Conflict>;
};

/** on_conflict condition type for table "dev.User" */
export type Dev_User_On_Conflict = {
  constraint: Dev_User_Constraint;
  update_columns?: Array<Dev_User_Update_Column>;
  where?: InputMaybe<Dev_User_Bool_Exp>;
};

/** Ordering options when selecting data from "dev.User". */
export type Dev_User_Order_By = {
  Id?: InputMaybe<Order_By>;
  Mail?: InputMaybe<Order_By>;
  Name?: InputMaybe<Order_By>;
  Notifications_aggregate?: InputMaybe<Dev_Notification_Aggregate_Order_By>;
  Pricing?: InputMaybe<Order_By>;
};

/** primary key columns input for table: dev.User */
export type Dev_User_Pk_Columns_Input = {
  Id: Scalars['uuid']['input'];
};

/** select columns of table "dev.User" */
export enum Dev_User_Select_Column {
  /** column name */
  Id = 'Id',
  /** column name */
  Mail = 'Mail',
  /** column name */
  Name = 'Name',
  /** column name */
  Pricing = 'Pricing'
}

/** input type for updating data in table "dev.User" */
export type Dev_User_Set_Input = {
  Id?: InputMaybe<Scalars['uuid']['input']>;
  Mail?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Pricing?: InputMaybe<Scalars['pricing_enum']['input']>;
};

/** Streaming cursor of the table "dev_User" */
export type Dev_User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dev_User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dev_User_Stream_Cursor_Value_Input = {
  Id?: InputMaybe<Scalars['uuid']['input']>;
  Mail?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Pricing?: InputMaybe<Scalars['pricing_enum']['input']>;
};

/** update columns of table "dev.User" */
export enum Dev_User_Update_Column {
  /** column name */
  Id = 'Id',
  /** column name */
  Mail = 'Mail',
  /** column name */
  Name = 'Name',
  /** column name */
  Pricing = 'Pricing'
}

export type Dev_User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Dev_User_Set_Input>;
  /** filter the rows which have to be updated */
  where: Dev_User_Bool_Exp;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "dev.Notification" */
  delete_dev_Notification?: Maybe<Dev_Notification_Mutation_Response>;
  /** delete single row from the table: "dev.Notification" */
  delete_dev_Notification_by_pk?: Maybe<Dev_Notification>;
  /** delete data from the table: "dev.User" */
  delete_dev_User?: Maybe<Dev_User_Mutation_Response>;
  /** delete single row from the table: "dev.User" */
  delete_dev_User_by_pk?: Maybe<Dev_User>;
  /** delete data from the table: "prod.Notification" */
  delete_prod_Notification?: Maybe<Prod_Notification_Mutation_Response>;
  /** delete single row from the table: "prod.Notification" */
  delete_prod_Notification_by_pk?: Maybe<Prod_Notification>;
  /** delete data from the table: "prod.User" */
  delete_prod_User?: Maybe<Prod_User_Mutation_Response>;
  /** delete single row from the table: "prod.User" */
  delete_prod_User_by_pk?: Maybe<Prod_User>;
  /** insert data into the table: "dev.Notification" */
  insert_dev_Notification?: Maybe<Dev_Notification_Mutation_Response>;
  /** insert a single row into the table: "dev.Notification" */
  insert_dev_Notification_one?: Maybe<Dev_Notification>;
  /** insert data into the table: "dev.User" */
  insert_dev_User?: Maybe<Dev_User_Mutation_Response>;
  /** insert a single row into the table: "dev.User" */
  insert_dev_User_one?: Maybe<Dev_User>;
  /** insert data into the table: "prod.Notification" */
  insert_prod_Notification?: Maybe<Prod_Notification_Mutation_Response>;
  /** insert a single row into the table: "prod.Notification" */
  insert_prod_Notification_one?: Maybe<Prod_Notification>;
  /** insert data into the table: "prod.User" */
  insert_prod_User?: Maybe<Prod_User_Mutation_Response>;
  /** insert a single row into the table: "prod.User" */
  insert_prod_User_one?: Maybe<Prod_User>;
  /** update data of the table: "dev.Notification" */
  update_dev_Notification?: Maybe<Dev_Notification_Mutation_Response>;
  /** update single row of the table: "dev.Notification" */
  update_dev_Notification_by_pk?: Maybe<Dev_Notification>;
  /** update multiples rows of table: "dev.Notification" */
  update_dev_Notification_many?: Maybe<Array<Maybe<Dev_Notification_Mutation_Response>>>;
  /** update data of the table: "dev.User" */
  update_dev_User?: Maybe<Dev_User_Mutation_Response>;
  /** update single row of the table: "dev.User" */
  update_dev_User_by_pk?: Maybe<Dev_User>;
  /** update multiples rows of table: "dev.User" */
  update_dev_User_many?: Maybe<Array<Maybe<Dev_User_Mutation_Response>>>;
  /** update data of the table: "prod.Notification" */
  update_prod_Notification?: Maybe<Prod_Notification_Mutation_Response>;
  /** update single row of the table: "prod.Notification" */
  update_prod_Notification_by_pk?: Maybe<Prod_Notification>;
  /** update multiples rows of table: "prod.Notification" */
  update_prod_Notification_many?: Maybe<Array<Maybe<Prod_Notification_Mutation_Response>>>;
  /** update data of the table: "prod.User" */
  update_prod_User?: Maybe<Prod_User_Mutation_Response>;
  /** update single row of the table: "prod.User" */
  update_prod_User_by_pk?: Maybe<Prod_User>;
  /** update multiples rows of table: "prod.User" */
  update_prod_User_many?: Maybe<Array<Maybe<Prod_User_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_Dev_NotificationArgs = {
  where: Dev_Notification_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Dev_Notification_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Dev_UserArgs = {
  where: Dev_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Dev_User_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Prod_NotificationArgs = {
  where: Prod_Notification_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Prod_Notification_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Prod_UserArgs = {
  where: Prod_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Prod_User_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootInsert_Dev_NotificationArgs = {
  objects: Array<Dev_Notification_Insert_Input>;
  on_conflict?: InputMaybe<Dev_Notification_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Dev_Notification_OneArgs = {
  object: Dev_Notification_Insert_Input;
  on_conflict?: InputMaybe<Dev_Notification_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Dev_UserArgs = {
  objects: Array<Dev_User_Insert_Input>;
  on_conflict?: InputMaybe<Dev_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Dev_User_OneArgs = {
  object: Dev_User_Insert_Input;
  on_conflict?: InputMaybe<Dev_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Prod_NotificationArgs = {
  objects: Array<Prod_Notification_Insert_Input>;
  on_conflict?: InputMaybe<Prod_Notification_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Prod_Notification_OneArgs = {
  object: Prod_Notification_Insert_Input;
  on_conflict?: InputMaybe<Prod_Notification_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Prod_UserArgs = {
  objects: Array<Prod_User_Insert_Input>;
  on_conflict?: InputMaybe<Prod_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Prod_User_OneArgs = {
  object: Prod_User_Insert_Input;
  on_conflict?: InputMaybe<Prod_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Dev_NotificationArgs = {
  _inc?: InputMaybe<Dev_Notification_Inc_Input>;
  _set?: InputMaybe<Dev_Notification_Set_Input>;
  where: Dev_Notification_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Dev_Notification_By_PkArgs = {
  _inc?: InputMaybe<Dev_Notification_Inc_Input>;
  _set?: InputMaybe<Dev_Notification_Set_Input>;
  pk_columns: Dev_Notification_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Dev_Notification_ManyArgs = {
  updates: Array<Dev_Notification_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Dev_UserArgs = {
  _set?: InputMaybe<Dev_User_Set_Input>;
  where: Dev_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Dev_User_By_PkArgs = {
  _set?: InputMaybe<Dev_User_Set_Input>;
  pk_columns: Dev_User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Dev_User_ManyArgs = {
  updates: Array<Dev_User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Prod_NotificationArgs = {
  _inc?: InputMaybe<Prod_Notification_Inc_Input>;
  _set?: InputMaybe<Prod_Notification_Set_Input>;
  where: Prod_Notification_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Prod_Notification_By_PkArgs = {
  _inc?: InputMaybe<Prod_Notification_Inc_Input>;
  _set?: InputMaybe<Prod_Notification_Set_Input>;
  pk_columns: Prod_Notification_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Prod_Notification_ManyArgs = {
  updates: Array<Prod_Notification_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Prod_UserArgs = {
  _set?: InputMaybe<Prod_User_Set_Input>;
  where: Prod_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Prod_User_By_PkArgs = {
  _set?: InputMaybe<Prod_User_Set_Input>;
  pk_columns: Prod_User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Prod_User_ManyArgs = {
  updates: Array<Prod_User_Updates>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** Boolean expression to compare columns of type "pricing_enum". All fields are combined with logical 'AND'. */
export type Pricing_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['pricing_enum']['input']>;
  _gt?: InputMaybe<Scalars['pricing_enum']['input']>;
  _gte?: InputMaybe<Scalars['pricing_enum']['input']>;
  _in?: InputMaybe<Array<Scalars['pricing_enum']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['pricing_enum']['input']>;
  _lte?: InputMaybe<Scalars['pricing_enum']['input']>;
  _neq?: InputMaybe<Scalars['pricing_enum']['input']>;
  _nin?: InputMaybe<Array<Scalars['pricing_enum']['input']>>;
};

/** columns and relationships of "prod.Notification" */
export type Prod_Notification = {
  __typename?: 'prod_Notification';
  Content: Scalars['String']['output'];
  CreatedAt: Scalars['timestamptz']['output'];
  DueDate: Scalars['timestamptz']['output'];
  Id: Scalars['uuid']['output'];
  RememberCount: Scalars['smallint']['output'];
  Subject: Scalars['String']['output'];
  /** An object relationship */
  User: Prod_User;
  UserId: Scalars['uuid']['output'];
};

/** aggregated selection of "prod.Notification" */
export type Prod_Notification_Aggregate = {
  __typename?: 'prod_Notification_aggregate';
  aggregate?: Maybe<Prod_Notification_Aggregate_Fields>;
  nodes: Array<Prod_Notification>;
};

export type Prod_Notification_Aggregate_Bool_Exp = {
  count?: InputMaybe<Prod_Notification_Aggregate_Bool_Exp_Count>;
};

export type Prod_Notification_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Prod_Notification_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Prod_Notification_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "prod.Notification" */
export type Prod_Notification_Aggregate_Fields = {
  __typename?: 'prod_Notification_aggregate_fields';
  avg?: Maybe<Prod_Notification_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Prod_Notification_Max_Fields>;
  min?: Maybe<Prod_Notification_Min_Fields>;
  stddev?: Maybe<Prod_Notification_Stddev_Fields>;
  stddev_pop?: Maybe<Prod_Notification_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Prod_Notification_Stddev_Samp_Fields>;
  sum?: Maybe<Prod_Notification_Sum_Fields>;
  var_pop?: Maybe<Prod_Notification_Var_Pop_Fields>;
  var_samp?: Maybe<Prod_Notification_Var_Samp_Fields>;
  variance?: Maybe<Prod_Notification_Variance_Fields>;
};


/** aggregate fields of "prod.Notification" */
export type Prod_Notification_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Prod_Notification_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "prod.Notification" */
export type Prod_Notification_Aggregate_Order_By = {
  avg?: InputMaybe<Prod_Notification_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Prod_Notification_Max_Order_By>;
  min?: InputMaybe<Prod_Notification_Min_Order_By>;
  stddev?: InputMaybe<Prod_Notification_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Prod_Notification_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Prod_Notification_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Prod_Notification_Sum_Order_By>;
  var_pop?: InputMaybe<Prod_Notification_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Prod_Notification_Var_Samp_Order_By>;
  variance?: InputMaybe<Prod_Notification_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "prod.Notification" */
export type Prod_Notification_Arr_Rel_Insert_Input = {
  data: Array<Prod_Notification_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Prod_Notification_On_Conflict>;
};

/** aggregate avg on columns */
export type Prod_Notification_Avg_Fields = {
  __typename?: 'prod_Notification_avg_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "prod.Notification" */
export type Prod_Notification_Avg_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "prod.Notification". All fields are combined with a logical 'AND'. */
export type Prod_Notification_Bool_Exp = {
  Content?: InputMaybe<String_Comparison_Exp>;
  CreatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  DueDate?: InputMaybe<Timestamptz_Comparison_Exp>;
  Id?: InputMaybe<Uuid_Comparison_Exp>;
  RememberCount?: InputMaybe<Smallint_Comparison_Exp>;
  Subject?: InputMaybe<String_Comparison_Exp>;
  User?: InputMaybe<Prod_User_Bool_Exp>;
  UserId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Prod_Notification_Bool_Exp>>;
  _not?: InputMaybe<Prod_Notification_Bool_Exp>;
  _or?: InputMaybe<Array<Prod_Notification_Bool_Exp>>;
};

/** unique or primary key constraints on table "prod.Notification" */
export enum Prod_Notification_Constraint {
  /** unique or primary key constraint on columns "Id" */
  NotificationPkey = 'Notification_pkey'
}

/** input type for incrementing numeric columns in table "prod.Notification" */
export type Prod_Notification_Inc_Input = {
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
};

/** input type for inserting data into table "prod.Notification" */
export type Prod_Notification_Insert_Input = {
  Content?: InputMaybe<Scalars['String']['input']>;
  CreatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  DueDate?: InputMaybe<Scalars['timestamptz']['input']>;
  Id?: InputMaybe<Scalars['uuid']['input']>;
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
  Subject?: InputMaybe<Scalars['String']['input']>;
  User?: InputMaybe<Prod_User_Obj_Rel_Insert_Input>;
  UserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Prod_Notification_Max_Fields = {
  __typename?: 'prod_Notification_max_fields';
  Content?: Maybe<Scalars['String']['output']>;
  CreatedAt?: Maybe<Scalars['timestamptz']['output']>;
  DueDate?: Maybe<Scalars['timestamptz']['output']>;
  Id?: Maybe<Scalars['uuid']['output']>;
  RememberCount?: Maybe<Scalars['smallint']['output']>;
  Subject?: Maybe<Scalars['String']['output']>;
  UserId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "prod.Notification" */
export type Prod_Notification_Max_Order_By = {
  Content?: InputMaybe<Order_By>;
  CreatedAt?: InputMaybe<Order_By>;
  DueDate?: InputMaybe<Order_By>;
  Id?: InputMaybe<Order_By>;
  RememberCount?: InputMaybe<Order_By>;
  Subject?: InputMaybe<Order_By>;
  UserId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Prod_Notification_Min_Fields = {
  __typename?: 'prod_Notification_min_fields';
  Content?: Maybe<Scalars['String']['output']>;
  CreatedAt?: Maybe<Scalars['timestamptz']['output']>;
  DueDate?: Maybe<Scalars['timestamptz']['output']>;
  Id?: Maybe<Scalars['uuid']['output']>;
  RememberCount?: Maybe<Scalars['smallint']['output']>;
  Subject?: Maybe<Scalars['String']['output']>;
  UserId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "prod.Notification" */
export type Prod_Notification_Min_Order_By = {
  Content?: InputMaybe<Order_By>;
  CreatedAt?: InputMaybe<Order_By>;
  DueDate?: InputMaybe<Order_By>;
  Id?: InputMaybe<Order_By>;
  RememberCount?: InputMaybe<Order_By>;
  Subject?: InputMaybe<Order_By>;
  UserId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "prod.Notification" */
export type Prod_Notification_Mutation_Response = {
  __typename?: 'prod_Notification_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Prod_Notification>;
};

/** on_conflict condition type for table "prod.Notification" */
export type Prod_Notification_On_Conflict = {
  constraint: Prod_Notification_Constraint;
  update_columns?: Array<Prod_Notification_Update_Column>;
  where?: InputMaybe<Prod_Notification_Bool_Exp>;
};

/** Ordering options when selecting data from "prod.Notification". */
export type Prod_Notification_Order_By = {
  Content?: InputMaybe<Order_By>;
  CreatedAt?: InputMaybe<Order_By>;
  DueDate?: InputMaybe<Order_By>;
  Id?: InputMaybe<Order_By>;
  RememberCount?: InputMaybe<Order_By>;
  Subject?: InputMaybe<Order_By>;
  User?: InputMaybe<Prod_User_Order_By>;
  UserId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: prod.Notification */
export type Prod_Notification_Pk_Columns_Input = {
  Id: Scalars['uuid']['input'];
};

/** select columns of table "prod.Notification" */
export enum Prod_Notification_Select_Column {
  /** column name */
  Content = 'Content',
  /** column name */
  CreatedAt = 'CreatedAt',
  /** column name */
  DueDate = 'DueDate',
  /** column name */
  Id = 'Id',
  /** column name */
  RememberCount = 'RememberCount',
  /** column name */
  Subject = 'Subject',
  /** column name */
  UserId = 'UserId'
}

/** input type for updating data in table "prod.Notification" */
export type Prod_Notification_Set_Input = {
  Content?: InputMaybe<Scalars['String']['input']>;
  CreatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  DueDate?: InputMaybe<Scalars['timestamptz']['input']>;
  Id?: InputMaybe<Scalars['uuid']['input']>;
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
  Subject?: InputMaybe<Scalars['String']['input']>;
  UserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Prod_Notification_Stddev_Fields = {
  __typename?: 'prod_Notification_stddev_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "prod.Notification" */
export type Prod_Notification_Stddev_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Prod_Notification_Stddev_Pop_Fields = {
  __typename?: 'prod_Notification_stddev_pop_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "prod.Notification" */
export type Prod_Notification_Stddev_Pop_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Prod_Notification_Stddev_Samp_Fields = {
  __typename?: 'prod_Notification_stddev_samp_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "prod.Notification" */
export type Prod_Notification_Stddev_Samp_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "prod_Notification" */
export type Prod_Notification_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Prod_Notification_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Prod_Notification_Stream_Cursor_Value_Input = {
  Content?: InputMaybe<Scalars['String']['input']>;
  CreatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  DueDate?: InputMaybe<Scalars['timestamptz']['input']>;
  Id?: InputMaybe<Scalars['uuid']['input']>;
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
  Subject?: InputMaybe<Scalars['String']['input']>;
  UserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Prod_Notification_Sum_Fields = {
  __typename?: 'prod_Notification_sum_fields';
  RememberCount?: Maybe<Scalars['smallint']['output']>;
};

/** order by sum() on columns of table "prod.Notification" */
export type Prod_Notification_Sum_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** update columns of table "prod.Notification" */
export enum Prod_Notification_Update_Column {
  /** column name */
  Content = 'Content',
  /** column name */
  CreatedAt = 'CreatedAt',
  /** column name */
  DueDate = 'DueDate',
  /** column name */
  Id = 'Id',
  /** column name */
  RememberCount = 'RememberCount',
  /** column name */
  Subject = 'Subject',
  /** column name */
  UserId = 'UserId'
}

export type Prod_Notification_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Prod_Notification_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Prod_Notification_Set_Input>;
  /** filter the rows which have to be updated */
  where: Prod_Notification_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Prod_Notification_Var_Pop_Fields = {
  __typename?: 'prod_Notification_var_pop_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "prod.Notification" */
export type Prod_Notification_Var_Pop_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Prod_Notification_Var_Samp_Fields = {
  __typename?: 'prod_Notification_var_samp_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "prod.Notification" */
export type Prod_Notification_Var_Samp_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Prod_Notification_Variance_Fields = {
  __typename?: 'prod_Notification_variance_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "prod.Notification" */
export type Prod_Notification_Variance_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** columns and relationships of "prod.User" */
export type Prod_User = {
  __typename?: 'prod_User';
  Id: Scalars['uuid']['output'];
  Mail: Scalars['String']['output'];
  Name: Scalars['String']['output'];
  /** An array relationship */
  Notifications: Array<Prod_Notification>;
  /** An aggregate relationship */
  Notifications_aggregate: Prod_Notification_Aggregate;
  Pricing?: Maybe<Scalars['pricing_enum']['output']>;
};


/** columns and relationships of "prod.User" */
export type Prod_UserNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Prod_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Prod_Notification_Order_By>>;
  where?: InputMaybe<Prod_Notification_Bool_Exp>;
};


/** columns and relationships of "prod.User" */
export type Prod_UserNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Prod_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Prod_Notification_Order_By>>;
  where?: InputMaybe<Prod_Notification_Bool_Exp>;
};

/** aggregated selection of "prod.User" */
export type Prod_User_Aggregate = {
  __typename?: 'prod_User_aggregate';
  aggregate?: Maybe<Prod_User_Aggregate_Fields>;
  nodes: Array<Prod_User>;
};

/** aggregate fields of "prod.User" */
export type Prod_User_Aggregate_Fields = {
  __typename?: 'prod_User_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Prod_User_Max_Fields>;
  min?: Maybe<Prod_User_Min_Fields>;
};


/** aggregate fields of "prod.User" */
export type Prod_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Prod_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "prod.User". All fields are combined with a logical 'AND'. */
export type Prod_User_Bool_Exp = {
  Id?: InputMaybe<Uuid_Comparison_Exp>;
  Mail?: InputMaybe<String_Comparison_Exp>;
  Name?: InputMaybe<String_Comparison_Exp>;
  Notifications?: InputMaybe<Prod_Notification_Bool_Exp>;
  Notifications_aggregate?: InputMaybe<Prod_Notification_Aggregate_Bool_Exp>;
  Pricing?: InputMaybe<Pricing_Enum_Comparison_Exp>;
  _and?: InputMaybe<Array<Prod_User_Bool_Exp>>;
  _not?: InputMaybe<Prod_User_Bool_Exp>;
  _or?: InputMaybe<Array<Prod_User_Bool_Exp>>;
};

/** unique or primary key constraints on table "prod.User" */
export enum Prod_User_Constraint {
  /** unique or primary key constraint on columns "Id" */
  UserPkey = 'User_pkey'
}

/** input type for inserting data into table "prod.User" */
export type Prod_User_Insert_Input = {
  Id?: InputMaybe<Scalars['uuid']['input']>;
  Mail?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Notifications?: InputMaybe<Prod_Notification_Arr_Rel_Insert_Input>;
  Pricing?: InputMaybe<Scalars['pricing_enum']['input']>;
};

/** aggregate max on columns */
export type Prod_User_Max_Fields = {
  __typename?: 'prod_User_max_fields';
  Id?: Maybe<Scalars['uuid']['output']>;
  Mail?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  Pricing?: Maybe<Scalars['pricing_enum']['output']>;
};

/** aggregate min on columns */
export type Prod_User_Min_Fields = {
  __typename?: 'prod_User_min_fields';
  Id?: Maybe<Scalars['uuid']['output']>;
  Mail?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  Pricing?: Maybe<Scalars['pricing_enum']['output']>;
};

/** response of any mutation on the table "prod.User" */
export type Prod_User_Mutation_Response = {
  __typename?: 'prod_User_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Prod_User>;
};

/** input type for inserting object relation for remote table "prod.User" */
export type Prod_User_Obj_Rel_Insert_Input = {
  data: Prod_User_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Prod_User_On_Conflict>;
};

/** on_conflict condition type for table "prod.User" */
export type Prod_User_On_Conflict = {
  constraint: Prod_User_Constraint;
  update_columns?: Array<Prod_User_Update_Column>;
  where?: InputMaybe<Prod_User_Bool_Exp>;
};

/** Ordering options when selecting data from "prod.User". */
export type Prod_User_Order_By = {
  Id?: InputMaybe<Order_By>;
  Mail?: InputMaybe<Order_By>;
  Name?: InputMaybe<Order_By>;
  Notifications_aggregate?: InputMaybe<Prod_Notification_Aggregate_Order_By>;
  Pricing?: InputMaybe<Order_By>;
};

/** primary key columns input for table: prod.User */
export type Prod_User_Pk_Columns_Input = {
  Id: Scalars['uuid']['input'];
};

/** select columns of table "prod.User" */
export enum Prod_User_Select_Column {
  /** column name */
  Id = 'Id',
  /** column name */
  Mail = 'Mail',
  /** column name */
  Name = 'Name',
  /** column name */
  Pricing = 'Pricing'
}

/** input type for updating data in table "prod.User" */
export type Prod_User_Set_Input = {
  Id?: InputMaybe<Scalars['uuid']['input']>;
  Mail?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Pricing?: InputMaybe<Scalars['pricing_enum']['input']>;
};

/** Streaming cursor of the table "prod_User" */
export type Prod_User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Prod_User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Prod_User_Stream_Cursor_Value_Input = {
  Id?: InputMaybe<Scalars['uuid']['input']>;
  Mail?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Pricing?: InputMaybe<Scalars['pricing_enum']['input']>;
};

/** update columns of table "prod.User" */
export enum Prod_User_Update_Column {
  /** column name */
  Id = 'Id',
  /** column name */
  Mail = 'Mail',
  /** column name */
  Name = 'Name',
  /** column name */
  Pricing = 'Pricing'
}

export type Prod_User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Prod_User_Set_Input>;
  /** filter the rows which have to be updated */
  where: Prod_User_Bool_Exp;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "dev.Notification" */
  dev_Notification: Array<Dev_Notification>;
  /** fetch aggregated fields from the table: "dev.Notification" */
  dev_Notification_aggregate: Dev_Notification_Aggregate;
  /** fetch data from the table: "dev.Notification" using primary key columns */
  dev_Notification_by_pk?: Maybe<Dev_Notification>;
  /** fetch data from the table: "dev.User" */
  dev_User: Array<Dev_User>;
  /** fetch aggregated fields from the table: "dev.User" */
  dev_User_aggregate: Dev_User_Aggregate;
  /** fetch data from the table: "dev.User" using primary key columns */
  dev_User_by_pk?: Maybe<Dev_User>;
  /** fetch data from the table: "prod.Notification" */
  prod_Notification: Array<Prod_Notification>;
  /** fetch aggregated fields from the table: "prod.Notification" */
  prod_Notification_aggregate: Prod_Notification_Aggregate;
  /** fetch data from the table: "prod.Notification" using primary key columns */
  prod_Notification_by_pk?: Maybe<Prod_Notification>;
  /** fetch data from the table: "prod.User" */
  prod_User: Array<Prod_User>;
  /** fetch aggregated fields from the table: "prod.User" */
  prod_User_aggregate: Prod_User_Aggregate;
  /** fetch data from the table: "prod.User" using primary key columns */
  prod_User_by_pk?: Maybe<Prod_User>;
};


export type Query_RootDev_NotificationArgs = {
  distinct_on?: InputMaybe<Array<Dev_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_Notification_Order_By>>;
  where?: InputMaybe<Dev_Notification_Bool_Exp>;
};


export type Query_RootDev_Notification_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dev_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_Notification_Order_By>>;
  where?: InputMaybe<Dev_Notification_Bool_Exp>;
};


export type Query_RootDev_Notification_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


export type Query_RootDev_UserArgs = {
  distinct_on?: InputMaybe<Array<Dev_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_User_Order_By>>;
  where?: InputMaybe<Dev_User_Bool_Exp>;
};


export type Query_RootDev_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dev_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_User_Order_By>>;
  where?: InputMaybe<Dev_User_Bool_Exp>;
};


export type Query_RootDev_User_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


export type Query_RootProd_NotificationArgs = {
  distinct_on?: InputMaybe<Array<Prod_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Prod_Notification_Order_By>>;
  where?: InputMaybe<Prod_Notification_Bool_Exp>;
};


export type Query_RootProd_Notification_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Prod_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Prod_Notification_Order_By>>;
  where?: InputMaybe<Prod_Notification_Bool_Exp>;
};


export type Query_RootProd_Notification_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


export type Query_RootProd_UserArgs = {
  distinct_on?: InputMaybe<Array<Prod_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Prod_User_Order_By>>;
  where?: InputMaybe<Prod_User_Bool_Exp>;
};


export type Query_RootProd_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Prod_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Prod_User_Order_By>>;
  where?: InputMaybe<Prod_User_Bool_Exp>;
};


export type Query_RootProd_User_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['smallint']['input']>;
  _gt?: InputMaybe<Scalars['smallint']['input']>;
  _gte?: InputMaybe<Scalars['smallint']['input']>;
  _in?: InputMaybe<Array<Scalars['smallint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['smallint']['input']>;
  _lte?: InputMaybe<Scalars['smallint']['input']>;
  _neq?: InputMaybe<Scalars['smallint']['input']>;
  _nin?: InputMaybe<Array<Scalars['smallint']['input']>>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "dev.Notification" */
  dev_Notification: Array<Dev_Notification>;
  /** fetch aggregated fields from the table: "dev.Notification" */
  dev_Notification_aggregate: Dev_Notification_Aggregate;
  /** fetch data from the table: "dev.Notification" using primary key columns */
  dev_Notification_by_pk?: Maybe<Dev_Notification>;
  /** fetch data from the table in a streaming manner: "dev.Notification" */
  dev_Notification_stream: Array<Dev_Notification>;
  /** fetch data from the table: "dev.User" */
  dev_User: Array<Dev_User>;
  /** fetch aggregated fields from the table: "dev.User" */
  dev_User_aggregate: Dev_User_Aggregate;
  /** fetch data from the table: "dev.User" using primary key columns */
  dev_User_by_pk?: Maybe<Dev_User>;
  /** fetch data from the table in a streaming manner: "dev.User" */
  dev_User_stream: Array<Dev_User>;
  /** fetch data from the table: "prod.Notification" */
  prod_Notification: Array<Prod_Notification>;
  /** fetch aggregated fields from the table: "prod.Notification" */
  prod_Notification_aggregate: Prod_Notification_Aggregate;
  /** fetch data from the table: "prod.Notification" using primary key columns */
  prod_Notification_by_pk?: Maybe<Prod_Notification>;
  /** fetch data from the table in a streaming manner: "prod.Notification" */
  prod_Notification_stream: Array<Prod_Notification>;
  /** fetch data from the table: "prod.User" */
  prod_User: Array<Prod_User>;
  /** fetch aggregated fields from the table: "prod.User" */
  prod_User_aggregate: Prod_User_Aggregate;
  /** fetch data from the table: "prod.User" using primary key columns */
  prod_User_by_pk?: Maybe<Prod_User>;
  /** fetch data from the table in a streaming manner: "prod.User" */
  prod_User_stream: Array<Prod_User>;
};


export type Subscription_RootDev_NotificationArgs = {
  distinct_on?: InputMaybe<Array<Dev_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_Notification_Order_By>>;
  where?: InputMaybe<Dev_Notification_Bool_Exp>;
};


export type Subscription_RootDev_Notification_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dev_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_Notification_Order_By>>;
  where?: InputMaybe<Dev_Notification_Bool_Exp>;
};


export type Subscription_RootDev_Notification_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


export type Subscription_RootDev_Notification_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dev_Notification_Stream_Cursor_Input>>;
  where?: InputMaybe<Dev_Notification_Bool_Exp>;
};


export type Subscription_RootDev_UserArgs = {
  distinct_on?: InputMaybe<Array<Dev_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_User_Order_By>>;
  where?: InputMaybe<Dev_User_Bool_Exp>;
};


export type Subscription_RootDev_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dev_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_User_Order_By>>;
  where?: InputMaybe<Dev_User_Bool_Exp>;
};


export type Subscription_RootDev_User_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


export type Subscription_RootDev_User_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dev_User_Stream_Cursor_Input>>;
  where?: InputMaybe<Dev_User_Bool_Exp>;
};


export type Subscription_RootProd_NotificationArgs = {
  distinct_on?: InputMaybe<Array<Prod_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Prod_Notification_Order_By>>;
  where?: InputMaybe<Prod_Notification_Bool_Exp>;
};


export type Subscription_RootProd_Notification_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Prod_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Prod_Notification_Order_By>>;
  where?: InputMaybe<Prod_Notification_Bool_Exp>;
};


export type Subscription_RootProd_Notification_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


export type Subscription_RootProd_Notification_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Prod_Notification_Stream_Cursor_Input>>;
  where?: InputMaybe<Prod_Notification_Bool_Exp>;
};


export type Subscription_RootProd_UserArgs = {
  distinct_on?: InputMaybe<Array<Prod_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Prod_User_Order_By>>;
  where?: InputMaybe<Prod_User_Bool_Exp>;
};


export type Subscription_RootProd_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Prod_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Prod_User_Order_By>>;
  where?: InputMaybe<Prod_User_Bool_Exp>;
};


export type Subscription_RootProd_User_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


export type Subscription_RootProd_User_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Prod_User_Stream_Cursor_Input>>;
  where?: InputMaybe<Prod_User_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

export type InsertNotification_DevMutationVariables = Exact<{
  objects: Array<Dev_Notification_Insert_Input> | Dev_Notification_Insert_Input;
}>;


export type InsertNotification_DevMutation = { __typename?: 'mutation_root', insert_dev_Notification?: { __typename?: 'dev_Notification_mutation_response', returning: Array<{ __typename?: 'dev_Notification', Subject: string }> } | null };

export type InsertNotification_ProdMutationVariables = Exact<{
  objects: Array<Prod_Notification_Insert_Input> | Prod_Notification_Insert_Input;
}>;


export type InsertNotification_ProdMutation = { __typename?: 'mutation_root', insert_prod_Notification?: { __typename?: 'prod_Notification_mutation_response', returning: Array<{ __typename?: 'prod_Notification', Subject: string }> } | null };

export type InsertUser_DevMutationVariables = Exact<{
  mail: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type InsertUser_DevMutation = { __typename?: 'mutation_root', insert_dev_User?: { __typename?: 'dev_User_mutation_response', returning: Array<{ __typename?: 'dev_User', Id: any, Name: string }> } | null };

export type InsertUser_ProdMutationVariables = Exact<{
  mail: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type InsertUser_ProdMutation = { __typename?: 'mutation_root', insert_prod_User?: { __typename?: 'prod_User_mutation_response', returning: Array<{ __typename?: 'prod_User', Id: any, Name: string }> } | null };

export type GetUserByMail_DevQueryVariables = Exact<{
  mail: Scalars['String']['input'];
}>;


export type GetUserByMail_DevQuery = { __typename?: 'query_root', dev_User: Array<{ __typename?: 'dev_User', Id: any, Name: string }> };

export type GetUserByMail_ProdQueryVariables = Exact<{
  mail: Scalars['String']['input'];
}>;


export type GetUserByMail_ProdQuery = { __typename?: 'query_root', prod_User: Array<{ __typename?: 'prod_User', Id: any, Name: string }> };

export const InsertNotification_DevDocument = gql`
    mutation InsertNotification_Dev($objects: [dev_Notification_insert_input!]!) {
  insert_dev_Notification(objects: $objects) {
    returning {
      Subject
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InsertNotification_DevGQL extends Apollo.Mutation<InsertNotification_DevMutation, InsertNotification_DevMutationVariables> {
    document = InsertNotification_DevDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InsertNotification_ProdDocument = gql`
    mutation InsertNotification_Prod($objects: [prod_Notification_insert_input!]!) {
  insert_prod_Notification(objects: $objects) {
    returning {
      Subject
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InsertNotification_ProdGQL extends Apollo.Mutation<InsertNotification_ProdMutation, InsertNotification_ProdMutationVariables> {
    document = InsertNotification_ProdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InsertUser_DevDocument = gql`
    mutation InsertUser_Dev($mail: String!, $name: String!) {
  insert_dev_User(objects: {Mail: $mail, Name: $name}) {
    returning {
      Id
      Name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InsertUser_DevGQL extends Apollo.Mutation<InsertUser_DevMutation, InsertUser_DevMutationVariables> {
    document = InsertUser_DevDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InsertUser_ProdDocument = gql`
    mutation InsertUser_Prod($mail: String!, $name: String!) {
  insert_prod_User(objects: {Mail: $mail, Name: $name}) {
    returning {
      Id
      Name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InsertUser_ProdGQL extends Apollo.Mutation<InsertUser_ProdMutation, InsertUser_ProdMutationVariables> {
    document = InsertUser_ProdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUserByMail_DevDocument = gql`
    query GetUserByMail_Dev($mail: String!) {
  dev_User(where: {Mail: {_eq: $mail}}) {
    Id
    Name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUserByMail_DevGQL extends Apollo.Query<GetUserByMail_DevQuery, GetUserByMail_DevQueryVariables> {
    document = GetUserByMail_DevDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUserByMail_ProdDocument = gql`
    query GetUserByMail_Prod($mail: String!) {
  prod_User(where: {Mail: {_eq: $mail}}) {
    Id
    Name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUserByMail_ProdGQL extends Apollo.Query<GetUserByMail_ProdQuery, GetUserByMail_ProdQueryVariables> {
    document = GetUserByMail_ProdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }