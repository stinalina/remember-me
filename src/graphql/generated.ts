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

/** columns and relationships of "dev.Notification" */
export type Notification = {
  __typename?: 'Notification';
  Content: Scalars['String']['output'];
  CreatedAt: Scalars['timestamptz']['output'];
  DueDate: Scalars['timestamptz']['output'];
  Id: Scalars['uuid']['output'];
  RememberCount: Scalars['smallint']['output'];
  Subject: Scalars['String']['output'];
  /** An object relationship */
  User: User;
  UserId: Scalars['uuid']['output'];
};

/** aggregated selection of "dev.Notification" */
export type Notification_Aggregate = {
  __typename?: 'Notification_aggregate';
  aggregate?: Maybe<Notification_Aggregate_Fields>;
  nodes: Array<Notification>;
};

export type Notification_Aggregate_Bool_Exp = {
  count?: InputMaybe<Notification_Aggregate_Bool_Exp_Count>;
};

export type Notification_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Notification_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Notification_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "dev.Notification" */
export type Notification_Aggregate_Fields = {
  __typename?: 'Notification_aggregate_fields';
  avg?: Maybe<Notification_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Notification_Max_Fields>;
  min?: Maybe<Notification_Min_Fields>;
  stddev?: Maybe<Notification_Stddev_Fields>;
  stddev_pop?: Maybe<Notification_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Notification_Stddev_Samp_Fields>;
  sum?: Maybe<Notification_Sum_Fields>;
  var_pop?: Maybe<Notification_Var_Pop_Fields>;
  var_samp?: Maybe<Notification_Var_Samp_Fields>;
  variance?: Maybe<Notification_Variance_Fields>;
};


/** aggregate fields of "dev.Notification" */
export type Notification_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Notification_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "dev.Notification" */
export type Notification_Aggregate_Order_By = {
  avg?: InputMaybe<Notification_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Notification_Max_Order_By>;
  min?: InputMaybe<Notification_Min_Order_By>;
  stddev?: InputMaybe<Notification_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Notification_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Notification_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Notification_Sum_Order_By>;
  var_pop?: InputMaybe<Notification_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Notification_Var_Samp_Order_By>;
  variance?: InputMaybe<Notification_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "dev.Notification" */
export type Notification_Arr_Rel_Insert_Input = {
  data: Array<Notification_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Notification_On_Conflict>;
};

/** aggregate avg on columns */
export type Notification_Avg_Fields = {
  __typename?: 'Notification_avg_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "dev.Notification" */
export type Notification_Avg_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "dev.Notification". All fields are combined with a logical 'AND'. */
export type Notification_Bool_Exp = {
  Content?: InputMaybe<String_Comparison_Exp>;
  CreatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  DueDate?: InputMaybe<Timestamptz_Comparison_Exp>;
  Id?: InputMaybe<Uuid_Comparison_Exp>;
  RememberCount?: InputMaybe<Smallint_Comparison_Exp>;
  Subject?: InputMaybe<String_Comparison_Exp>;
  User?: InputMaybe<User_Bool_Exp>;
  UserId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Notification_Bool_Exp>>;
  _not?: InputMaybe<Notification_Bool_Exp>;
  _or?: InputMaybe<Array<Notification_Bool_Exp>>;
};

/** unique or primary key constraints on table "dev.Notification" */
export enum Notification_Constraint {
  /** unique or primary key constraint on columns "Id" */
  NotificationPkey = 'Notification_pkey'
}

/** input type for incrementing numeric columns in table "dev.Notification" */
export type Notification_Inc_Input = {
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
};

/** input type for inserting data into table "dev.Notification" */
export type Notification_Insert_Input = {
  Content?: InputMaybe<Scalars['String']['input']>;
  CreatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  DueDate?: InputMaybe<Scalars['timestamptz']['input']>;
  Id?: InputMaybe<Scalars['uuid']['input']>;
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
  Subject?: InputMaybe<Scalars['String']['input']>;
  User?: InputMaybe<User_Obj_Rel_Insert_Input>;
  UserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Notification_Max_Fields = {
  __typename?: 'Notification_max_fields';
  Content?: Maybe<Scalars['String']['output']>;
  CreatedAt?: Maybe<Scalars['timestamptz']['output']>;
  DueDate?: Maybe<Scalars['timestamptz']['output']>;
  Id?: Maybe<Scalars['uuid']['output']>;
  RememberCount?: Maybe<Scalars['smallint']['output']>;
  Subject?: Maybe<Scalars['String']['output']>;
  UserId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "dev.Notification" */
export type Notification_Max_Order_By = {
  Content?: InputMaybe<Order_By>;
  CreatedAt?: InputMaybe<Order_By>;
  DueDate?: InputMaybe<Order_By>;
  Id?: InputMaybe<Order_By>;
  RememberCount?: InputMaybe<Order_By>;
  Subject?: InputMaybe<Order_By>;
  UserId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Notification_Min_Fields = {
  __typename?: 'Notification_min_fields';
  Content?: Maybe<Scalars['String']['output']>;
  CreatedAt?: Maybe<Scalars['timestamptz']['output']>;
  DueDate?: Maybe<Scalars['timestamptz']['output']>;
  Id?: Maybe<Scalars['uuid']['output']>;
  RememberCount?: Maybe<Scalars['smallint']['output']>;
  Subject?: Maybe<Scalars['String']['output']>;
  UserId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "dev.Notification" */
export type Notification_Min_Order_By = {
  Content?: InputMaybe<Order_By>;
  CreatedAt?: InputMaybe<Order_By>;
  DueDate?: InputMaybe<Order_By>;
  Id?: InputMaybe<Order_By>;
  RememberCount?: InputMaybe<Order_By>;
  Subject?: InputMaybe<Order_By>;
  UserId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "dev.Notification" */
export type Notification_Mutation_Response = {
  __typename?: 'Notification_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Notification>;
};

/** on_conflict condition type for table "dev.Notification" */
export type Notification_On_Conflict = {
  constraint: Notification_Constraint;
  update_columns?: Array<Notification_Update_Column>;
  where?: InputMaybe<Notification_Bool_Exp>;
};

/** Ordering options when selecting data from "dev.Notification". */
export type Notification_Order_By = {
  Content?: InputMaybe<Order_By>;
  CreatedAt?: InputMaybe<Order_By>;
  DueDate?: InputMaybe<Order_By>;
  Id?: InputMaybe<Order_By>;
  RememberCount?: InputMaybe<Order_By>;
  Subject?: InputMaybe<Order_By>;
  User?: InputMaybe<User_Order_By>;
  UserId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: dev.Notification */
export type Notification_Pk_Columns_Input = {
  Id: Scalars['uuid']['input'];
};

/** select columns of table "dev.Notification" */
export enum Notification_Select_Column {
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
export type Notification_Set_Input = {
  Content?: InputMaybe<Scalars['String']['input']>;
  CreatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  DueDate?: InputMaybe<Scalars['timestamptz']['input']>;
  Id?: InputMaybe<Scalars['uuid']['input']>;
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
  Subject?: InputMaybe<Scalars['String']['input']>;
  UserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Notification_Stddev_Fields = {
  __typename?: 'Notification_stddev_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "dev.Notification" */
export type Notification_Stddev_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Notification_Stddev_Pop_Fields = {
  __typename?: 'Notification_stddev_pop_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "dev.Notification" */
export type Notification_Stddev_Pop_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Notification_Stddev_Samp_Fields = {
  __typename?: 'Notification_stddev_samp_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "dev.Notification" */
export type Notification_Stddev_Samp_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Notification" */
export type Notification_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Notification_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Notification_Stream_Cursor_Value_Input = {
  Content?: InputMaybe<Scalars['String']['input']>;
  CreatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  DueDate?: InputMaybe<Scalars['timestamptz']['input']>;
  Id?: InputMaybe<Scalars['uuid']['input']>;
  RememberCount?: InputMaybe<Scalars['smallint']['input']>;
  Subject?: InputMaybe<Scalars['String']['input']>;
  UserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Notification_Sum_Fields = {
  __typename?: 'Notification_sum_fields';
  RememberCount?: Maybe<Scalars['smallint']['output']>;
};

/** order by sum() on columns of table "dev.Notification" */
export type Notification_Sum_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** update columns of table "dev.Notification" */
export enum Notification_Update_Column {
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

export type Notification_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Notification_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Notification_Set_Input>;
  /** filter the rows which have to be updated */
  where: Notification_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Notification_Var_Pop_Fields = {
  __typename?: 'Notification_var_pop_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "dev.Notification" */
export type Notification_Var_Pop_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Notification_Var_Samp_Fields = {
  __typename?: 'Notification_var_samp_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "dev.Notification" */
export type Notification_Var_Samp_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Notification_Variance_Fields = {
  __typename?: 'Notification_variance_fields';
  RememberCount?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "dev.Notification" */
export type Notification_Variance_Order_By = {
  RememberCount?: InputMaybe<Order_By>;
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

/** columns and relationships of "dev.User" */
export type User = {
  __typename?: 'User';
  Id: Scalars['uuid']['output'];
  Mail: Scalars['String']['output'];
  Name: Scalars['String']['output'];
  /** An array relationship */
  Notifications: Array<Notification>;
  /** An aggregate relationship */
  Notifications_aggregate: Notification_Aggregate;
  Pricing?: Maybe<Scalars['pricing_enum']['output']>;
};


/** columns and relationships of "dev.User" */
export type UserNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Notification_Order_By>>;
  where?: InputMaybe<Notification_Bool_Exp>;
};


/** columns and relationships of "dev.User" */
export type UserNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Notification_Order_By>>;
  where?: InputMaybe<Notification_Bool_Exp>;
};

/** aggregated selection of "dev.User" */
export type User_Aggregate = {
  __typename?: 'User_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "dev.User" */
export type User_Aggregate_Fields = {
  __typename?: 'User_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
};


/** aggregate fields of "dev.User" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "dev.User". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  Id?: InputMaybe<Uuid_Comparison_Exp>;
  Mail?: InputMaybe<String_Comparison_Exp>;
  Name?: InputMaybe<String_Comparison_Exp>;
  Notifications?: InputMaybe<Notification_Bool_Exp>;
  Notifications_aggregate?: InputMaybe<Notification_Aggregate_Bool_Exp>;
  Pricing?: InputMaybe<Pricing_Enum_Comparison_Exp>;
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
};

/** unique or primary key constraints on table "dev.User" */
export enum User_Constraint {
  /** unique or primary key constraint on columns "Id" */
  UserPkey = 'User_pkey'
}

/** input type for inserting data into table "dev.User" */
export type User_Insert_Input = {
  Id?: InputMaybe<Scalars['uuid']['input']>;
  Mail?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Notifications?: InputMaybe<Notification_Arr_Rel_Insert_Input>;
  Pricing?: InputMaybe<Scalars['pricing_enum']['input']>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'User_max_fields';
  Id?: Maybe<Scalars['uuid']['output']>;
  Mail?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  Pricing?: Maybe<Scalars['pricing_enum']['output']>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'User_min_fields';
  Id?: Maybe<Scalars['uuid']['output']>;
  Mail?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  Pricing?: Maybe<Scalars['pricing_enum']['output']>;
};

/** response of any mutation on the table "dev.User" */
export type User_Mutation_Response = {
  __typename?: 'User_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
};

/** input type for inserting object relation for remote table "dev.User" */
export type User_Obj_Rel_Insert_Input = {
  data: User_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<User_On_Conflict>;
};

/** on_conflict condition type for table "dev.User" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Ordering options when selecting data from "dev.User". */
export type User_Order_By = {
  Id?: InputMaybe<Order_By>;
  Mail?: InputMaybe<Order_By>;
  Name?: InputMaybe<Order_By>;
  Notifications_aggregate?: InputMaybe<Notification_Aggregate_Order_By>;
  Pricing?: InputMaybe<Order_By>;
};

/** primary key columns input for table: dev.User */
export type User_Pk_Columns_Input = {
  Id: Scalars['uuid']['input'];
};

/** select columns of table "dev.User" */
export enum User_Select_Column {
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
export type User_Set_Input = {
  Id?: InputMaybe<Scalars['uuid']['input']>;
  Mail?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Pricing?: InputMaybe<Scalars['pricing_enum']['input']>;
};

/** Streaming cursor of the table "User" */
export type User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Stream_Cursor_Value_Input = {
  Id?: InputMaybe<Scalars['uuid']['input']>;
  Mail?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Pricing?: InputMaybe<Scalars['pricing_enum']['input']>;
};

/** update columns of table "dev.User" */
export enum User_Update_Column {
  /** column name */
  Id = 'Id',
  /** column name */
  Mail = 'Mail',
  /** column name */
  Name = 'Name',
  /** column name */
  Pricing = 'Pricing'
}

export type User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Bool_Exp;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "dev.Notification" */
  delete_Notification?: Maybe<Notification_Mutation_Response>;
  /** delete single row from the table: "dev.Notification" */
  delete_Notification_by_pk?: Maybe<Notification>;
  /** delete data from the table: "dev.User" */
  delete_User?: Maybe<User_Mutation_Response>;
  /** delete single row from the table: "dev.User" */
  delete_User_by_pk?: Maybe<User>;
  /** insert data into the table: "dev.Notification" */
  insert_Notification?: Maybe<Notification_Mutation_Response>;
  /** insert a single row into the table: "dev.Notification" */
  insert_Notification_one?: Maybe<Notification>;
  /** insert data into the table: "dev.User" */
  insert_User?: Maybe<User_Mutation_Response>;
  /** insert a single row into the table: "dev.User" */
  insert_User_one?: Maybe<User>;
  /** update data of the table: "dev.Notification" */
  update_Notification?: Maybe<Notification_Mutation_Response>;
  /** update single row of the table: "dev.Notification" */
  update_Notification_by_pk?: Maybe<Notification>;
  /** update multiples rows of table: "dev.Notification" */
  update_Notification_many?: Maybe<Array<Maybe<Notification_Mutation_Response>>>;
  /** update data of the table: "dev.User" */
  update_User?: Maybe<User_Mutation_Response>;
  /** update single row of the table: "dev.User" */
  update_User_by_pk?: Maybe<User>;
  /** update multiples rows of table: "dev.User" */
  update_User_many?: Maybe<Array<Maybe<User_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_NotificationArgs = {
  where: Notification_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Notification_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootInsert_NotificationArgs = {
  objects: Array<Notification_Insert_Input>;
  on_conflict?: InputMaybe<Notification_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Notification_OneArgs = {
  object: Notification_Insert_Input;
  on_conflict?: InputMaybe<Notification_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_NotificationArgs = {
  _inc?: InputMaybe<Notification_Inc_Input>;
  _set?: InputMaybe<Notification_Set_Input>;
  where: Notification_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Notification_By_PkArgs = {
  _inc?: InputMaybe<Notification_Inc_Input>;
  _set?: InputMaybe<Notification_Set_Input>;
  pk_columns: Notification_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Notification_ManyArgs = {
  updates: Array<Notification_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _set?: InputMaybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _set?: InputMaybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_ManyArgs = {
  updates: Array<User_Updates>;
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

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "dev.Notification" */
  Notification: Array<Notification>;
  /** fetch aggregated fields from the table: "dev.Notification" */
  Notification_aggregate: Notification_Aggregate;
  /** fetch data from the table: "dev.Notification" using primary key columns */
  Notification_by_pk?: Maybe<Notification>;
  /** fetch data from the table: "dev.User" */
  User: Array<User>;
  /** fetch aggregated fields from the table: "dev.User" */
  User_aggregate: User_Aggregate;
  /** fetch data from the table: "dev.User" using primary key columns */
  User_by_pk?: Maybe<User>;
};


export type Query_RootNotificationArgs = {
  distinct_on?: InputMaybe<Array<Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Notification_Order_By>>;
  where?: InputMaybe<Notification_Bool_Exp>;
};


export type Query_RootNotification_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Notification_Order_By>>;
  where?: InputMaybe<Notification_Bool_Exp>;
};


export type Query_RootNotification_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_By_PkArgs = {
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
  Notification: Array<Notification>;
  /** fetch aggregated fields from the table: "dev.Notification" */
  Notification_aggregate: Notification_Aggregate;
  /** fetch data from the table: "dev.Notification" using primary key columns */
  Notification_by_pk?: Maybe<Notification>;
  /** fetch data from the table in a streaming manner: "dev.Notification" */
  Notification_stream: Array<Notification>;
  /** fetch data from the table: "dev.User" */
  User: Array<User>;
  /** fetch aggregated fields from the table: "dev.User" */
  User_aggregate: User_Aggregate;
  /** fetch data from the table: "dev.User" using primary key columns */
  User_by_pk?: Maybe<User>;
  /** fetch data from the table in a streaming manner: "dev.User" */
  User_stream: Array<User>;
};


export type Subscription_RootNotificationArgs = {
  distinct_on?: InputMaybe<Array<Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Notification_Order_By>>;
  where?: InputMaybe<Notification_Bool_Exp>;
};


export type Subscription_RootNotification_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Notification_Order_By>>;
  where?: InputMaybe<Notification_Bool_Exp>;
};


export type Subscription_RootNotification_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


export type Subscription_RootNotification_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Notification_Stream_Cursor_Input>>;
  where?: InputMaybe<Notification_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_By_PkArgs = {
  Id: Scalars['uuid']['input'];
};


export type Subscription_RootUser_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Bool_Exp>;
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
  objects: Array<Notification_Insert_Input> | Notification_Insert_Input;
}>;


export type InsertNotificationMutation = { __typename?: 'mutation_root', insert_Notification?: { __typename?: 'Notification_mutation_response', affected_rows: number } | null };

export type NotificationByUserIdQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['uuid']['input']>;
}>;


export type NotificationByUserIdQuery = { __typename?: 'query_root', Notification: Array<{ __typename?: 'Notification', Content: string, CreatedAt: any, Subject: string, RememberCount: any, Id: any, DueDate: any }> };

export type InsertUserMutationVariables = Exact<{
  mail: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type InsertUserMutation = { __typename?: 'mutation_root', insert_User?: { __typename?: 'User_mutation_response', returning: Array<{ __typename?: 'User', Id: any, Name: string }> } | null };

export type GetUserByMailQueryVariables = Exact<{
  mail: Scalars['String']['input'];
}>;


export type GetUserByMailQuery = { __typename?: 'query_root', User: Array<{ __typename?: 'User', Id: any, Name: string }> };

export const InsertNotificationDocument = gql`
    mutation InsertNotification($objects: [Notification_insert_input!]!) {
  insert_Notification(objects: $objects) {
    affected_rows
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
export const NotificationByUserIdDocument = gql`
    query NotificationByUserId($userId: uuid) {
  Notification(order_by: {CreatedAt: desc}, where: {UserId: {_eq: $userId}}) {
    Content
    CreatedAt
    Subject
    RememberCount
    Id
    DueDate
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class NotificationByUserIdGQL extends Apollo.Query<NotificationByUserIdQuery, NotificationByUserIdQueryVariables> {
    document = NotificationByUserIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InsertUserDocument = gql`
    mutation InsertUser($mail: String!, $name: String!) {
  insert_User(objects: {Mail: $mail, Name: $name}) {
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
  User(where: {Mail: {_eq: $mail}}) {
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