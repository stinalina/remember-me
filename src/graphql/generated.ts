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
  User_Notification_Relation: Array<Dev_Notification>;
  /** An aggregate relationship */
  User_Notification_Relation_aggregate: Dev_Notification_Aggregate;
};


/** columns and relationships of "dev.User" */
export type Dev_UserUser_Notification_RelationArgs = {
  distinct_on?: InputMaybe<Array<Dev_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dev_Notification_Order_By>>;
  where?: InputMaybe<Dev_Notification_Bool_Exp>;
};


/** columns and relationships of "dev.User" */
export type Dev_UserUser_Notification_Relation_AggregateArgs = {
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
  User_Notification_Relation?: InputMaybe<Dev_Notification_Bool_Exp>;
  User_Notification_Relation_aggregate?: InputMaybe<Dev_Notification_Aggregate_Bool_Exp>;
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
  User_Notification_Relation?: InputMaybe<Dev_Notification_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Dev_User_Max_Fields = {
  __typename?: 'dev_User_max_fields';
  Id?: Maybe<Scalars['uuid']['output']>;
  Mail?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Dev_User_Min_Fields = {
  __typename?: 'dev_User_min_fields';
  Id?: Maybe<Scalars['uuid']['output']>;
  Mail?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "dev.User" */
export type Dev_User_Mutation_Response = {
  __typename?: 'dev_User_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Dev_User>;
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
  User_Notification_Relation_aggregate?: InputMaybe<Dev_Notification_Aggregate_Order_By>;
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
  Name = 'Name'
}

/** input type for updating data in table "dev.User" */
export type Dev_User_Set_Input = {
  Id?: InputMaybe<Scalars['uuid']['input']>;
  Mail?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
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
};

/** update columns of table "dev.User" */
export enum Dev_User_Update_Column {
  /** column name */
  Id = 'Id',
  /** column name */
  Mail = 'Mail',
  /** column name */
  Name = 'Name'
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
  /** insert data into the table: "dev.Notification" */
  insert_dev_Notification?: Maybe<Dev_Notification_Mutation_Response>;
  /** insert a single row into the table: "dev.Notification" */
  insert_dev_Notification_one?: Maybe<Dev_Notification>;
  /** insert data into the table: "dev.User" */
  insert_dev_User?: Maybe<Dev_User_Mutation_Response>;
  /** insert a single row into the table: "dev.User" */
  insert_dev_User_one?: Maybe<Dev_User>;
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

export type InsertNotificationMutationVariables = Exact<{
  objects: Array<Dev_Notification_Insert_Input> | Dev_Notification_Insert_Input;
}>;


export type InsertNotificationMutation = { __typename?: 'mutation_root', insert_dev_Notification?: { __typename?: 'dev_Notification_mutation_response', returning: Array<{ __typename?: 'dev_Notification', Subject: string }> } | null };

export type InsertUserMutationVariables = Exact<{
  mail: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type InsertUserMutation = { __typename?: 'mutation_root', insert_dev_User?: { __typename?: 'dev_User_mutation_response', returning: Array<{ __typename?: 'dev_User', Id: any, Name: string }> } | null };

export type GetUserByMailQueryVariables = Exact<{
  mail: Scalars['String']['input'];
}>;


export type GetUserByMailQuery = { __typename?: 'query_root', dev_User: Array<{ __typename?: 'dev_User', Id: any, Name: string }> };

export const InsertNotificationDocument = gql`
    mutation InsertNotification($objects: [dev_Notification_insert_input!]!) {
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
  export class InsertNotificationGQL extends Apollo.Mutation<InsertNotificationMutation, InsertNotificationMutationVariables> {
    document = InsertNotificationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InsertUserDocument = gql`
    mutation InsertUser($mail: String!, $name: String!) {
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
  export class InsertUserGQL extends Apollo.Mutation<InsertUserMutation, InsertUserMutationVariables> {
    document = InsertUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUserByMailDocument = gql`
    query GetUserByMail($mail: String!) {
  dev_User(where: {Mail: {_eq: $mail}}) {
    Id
    Name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUserByMailGQL extends Apollo.Query<GetUserByMailQuery, GetUserByMailQueryVariables> {
    document = GetUserByMailDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }